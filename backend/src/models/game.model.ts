export type GameType = "30m" | "10m" | "3m";
export type GameState =
  | "isWaiting"
  | "isPlaying"
  | "whiteWon"
  | "blackWon"
  | "draw";
  
export type Color = "white" | "black";

export interface Config {
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
  remaningTime: number;
}

export interface Move {
  from: Position;
  to: Position;
}

export interface Position {
  x: number;
  y: number;
}
