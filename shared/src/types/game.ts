import { Color, Move } from "./chess.js";

export type GameType = "30m" | "10m" | "3m";
export type GameState =
  | "isWaiting"
  | "isPlaying"
  | "whiteWin"
  | "blackWin"
  | "draw";

export interface GameConfig {
  playerSide: Color;
  gameType: GameType;
}

export interface Game {
  moves: Move[];
  playerTurn: Color;
  state: GameState;

  whiteSidePlayer: PlayerState | null;
  blackSidePlayer: PlayerState | null;
  gameType: GameType;
  createdAt: number;
}

export interface PlayerState {
  userId: string;
  remainingTime: number;
}