import { Game, GameType } from "@check-mate/shared/types";
import ChessService from "../services/chess.service.js";

interface GameTiming {
  baseTime: number,
  inc: number
}

export const GAME_TIME_MS: Record<GameType, GameTiming> = {
  "30m": { baseTime: 30 * 60000, inc: 0 },
  "10m": { baseTime: 10 * 60000, inc: 3 * 1000 } ,
  "3m": { baseTime: 3 * 60000, inc: 5 * 1000 },
};

export const checkEndGame = (chess: ChessService, game: Game) => {
  if(chess.isStalemate(game.playerTurn)) {
    if(chess.isCheckMate(game.playerTurn)) {
      game.state = game.playerTurn == "white" ? "blackWin" : "whiteWin";
    }
    else {
      game.state = "draw";
    }
  }
}

export const updateTimeLeft = (game: Game) => {
  const now = Date.now();
  const timeElapsed = now - game.lastPlayedAt;
  const timeToAdd = GAME_TIME_MS[game.gameType].inc;

  if (game.playerTurn === "white") {
    if (game.whiteSidePlayer) {
      game.whiteSidePlayer.remainingTime = Math.max(game.whiteSidePlayer.remainingTime - timeElapsed + timeToAdd, 0);
    }
  } else {
    if (game.blackSidePlayer) {
      game.blackSidePlayer.remainingTime = Math.max(game.blackSidePlayer.remainingTime - timeElapsed + timeToAdd, 0);
    }
  }

  game.lastPlayedAt = now;
}