export type Color = "white" | "black";

export interface Move {
  from: Position;
  to: Position;
}

export interface Position {
  x: number;
  y: number;
}
