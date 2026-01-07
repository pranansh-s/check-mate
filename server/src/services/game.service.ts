import { randomUUID } from "node:crypto";

import dbController from "../controllers/db.controller.js";
import { ServiceError } from "../utils/error.js";
import { Game, GameConfig, Move, PlayerState } from "@check-mate/shared/types";
import { GAME_TIME_MS } from "../utils/game.js";
import { opponentSide } from "@check-mate/shared/utils";
import ChessService from "./chess.service.js";

const GAME_PREFIX = "games";
const roomToGameId = new Map<string, string>();

const GameService = {
  getGame: async (id: string): Promise<Game> => {
    const game = await dbController.loadData<Game>(GAME_PREFIX, id);
    if (!game) {
      throw new ServiceError("Game not found");
    }
    return game;
  },

  saveGame: (game: Game, id: string) => {
    return dbController.saveData<Game>(GAME_PREFIX, game, id);
  },

  isPlayingState: async (roomId: string): Promise<boolean> => {
    const gameId = roomToGameId.get(roomId);
    if (!gameId) {
      throw new ServiceError("No game in room");
    }

    let game = await GameService.getGame(gameId);
    return game.state === "isPlaying";
  },

  addMove: async (roomId: string, move: Move, chess: ChessService) => {
    const gameId = roomToGameId.get(roomId);
    if (!gameId) {
      throw new ServiceError("No game in room");
    }

    let game = await GameService.getGame(gameId);
    game.moves.push(move);
    game.playerTurn = opponentSide(game.playerTurn);
    if(chess.isDraw()) {
      // if(chess.isCheckMate()) {
      //   game.state = game.playerTurn == "white" ? "blackWin" : "whiteWin";
      // }
      // else {
        game.state = "draw";
      // }
    }

    await GameService.saveGame(game, gameId);
  },

  joinGame: async (roomId: string, userId: string): Promise<Game> => {
    const gameId = roomToGameId.get(roomId);
    if (!gameId) {
      throw new ServiceError("No game in room");
    }

    let game = await GameService.getGame(gameId);
    if (game.whiteSidePlayer?.userId === userId || game.blackSidePlayer?.userId === userId) {
      return game;
    }
    
    const newPlayer: PlayerState = {
      userId,
      remainingTime: GAME_TIME_MS[game.gameType],
    };

    if (!game.whiteSidePlayer) {
      game.whiteSidePlayer = newPlayer;
    } else if (!game.blackSidePlayer) {
      game.blackSidePlayer = newPlayer;
    }

    if (game.whiteSidePlayer && game.blackSidePlayer) {
      game.state = "isPlaying";
    }

    await GameService.saveGame(game, gameId);
    return game;
  },

  createGame: async (config: GameConfig, roomId: string, userId: string, opponentUserId?: string): Promise<Game> => {
    const { playerSide, gameType } = config;

    const playerState: PlayerState = {
      userId,
      remainingTime: GAME_TIME_MS[gameType],
    };

    const opponentPlayerState: PlayerState | null = opponentUserId ? {
      userId: opponentUserId,
      remainingTime: GAME_TIME_MS[gameType],
    } : null;

    const newGame: Game = {
      moves: [],
      playerTurn: "white",
      state: "isWaiting",

      whiteSidePlayer: playerSide == "white" ? playerState : opponentPlayerState,
      blackSidePlayer: playerSide == "black" ? playerState : opponentPlayerState,
      gameType,
      createdAt: Date.now(),
    };

    const uuid = randomUUID();
    roomToGameId.set(roomId, uuid);

    await GameService.saveGame(newGame, uuid);
    return newGame;
  },
}

export default GameService;
