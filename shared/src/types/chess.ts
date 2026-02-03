export type Color = 'white' | 'black';
export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
export type Board = (Piece | null)[][];

export interface Piece {
  src: string;
  type: PieceType;
  color: Color;
  pos: Position;
}

export interface Move {
  from: Position;
  to: Position;
}

export interface Position {
  x: number;
  y: number;
}
