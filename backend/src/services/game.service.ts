import { randomUUID } from "node:crypto";

import dbController from "../controllers/db.controller.js";
import { ServiceError } from "../models/error.js";
import { Config, Game, PlayerState } from "../models/game.model.js";
import { GAME_TIME_MS } from "../utils/game.js";

class GameService {
  private static roomToGameId = new Map<string, string>();

  private readonly GAME_PREFIX = "games";

  getGame = async (id: string): Promise<Game> => {
    const game = await dbController.loadData<Game>(this.GAME_PREFIX, id);
    if (!game) {
      throw new ServiceError("Game not found");
    }
    return game;
  };

  saveGame = async (game: Game, id: string) => {
    await dbController.saveData<Game>(this.GAME_PREFIX, game, id);
  };

  makeMove = async () => {};

  joinGame = async (roomId: string, userId: string): Promise<Game> => {
    const gameId = GameService.roomToGameId.get(roomId);
    if (!gameId) {
      throw new ServiceError("No game in room");
    }

    let game = await this.getGame(gameId);
    if (game.whiteSidePlayer?.userId === userId || game.blackSidePlayer?.userId === userId) {
      return game;
    }

    const newPlayer = {
      userId,
      remaningTime: GAME_TIME_MS[game.gameType],
    } as PlayerState;

    if (!game.whiteSidePlayer) {
      game.whiteSidePlayer = newPlayer;
    } else if (!game.blackSidePlayer) {
      game.blackSidePlayer = newPlayer;
    }

    if (game.whiteSidePlayer && game.blackSidePlayer) {
      game.state = "isPlaying";
    }

    await this.saveGame(game, gameId);
    return game;
  };

  createGame = async (roomId: string, userId: string, config: Config): Promise<Game> => {
    const { playerSide, gameType } = config;

    const playerState = {
      userId,
      remaningTime: GAME_TIME_MS[gameType],
    } as PlayerState;

    const newGame = {
      moves: [],
      playerTurn: "white",
      state: "isWaiting",

      whiteSidePlayer: playerSide == "white" ? playerState : null,
      blackSidePlayer: playerSide == "black" ? playerState : null,
      gameType,
      createdAt: Date.now(),
    } as Game;

    const uuid = randomUUID();
    GameService.roomToGameId.set(roomId, uuid);

    this.saveGame(newGame, uuid);
    return newGame;
  };
}

export default GameService;
