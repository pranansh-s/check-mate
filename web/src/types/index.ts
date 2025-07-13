import { Group } from 'three';

export type ModalType = 'gameSettings' | 'joinRoom' | 'waiting' | null;

export interface Position {
  x: number;
  y: number;
}

export interface Move {
  from: Position;
  to: Position;
}

export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
export type PieceColor = 'white' | 'black';

export type BoardMap = (Piece | null)[][];

export interface Piece {
  src: string;
  type: PieceType;
  color: PieceColor;
  pos: Position;
}

export interface IInputValue {
  value: string;
  error?: string;
}

export interface IModelState {
  color: boolean;
  initialPosition: [number, number, number];
  initialRotation: [number, number, number];
  rotationSpeed: [number, number, number];
  movementSpeed: [number, number];
}

export interface IFloatingModelProps extends IModelState {
  model: Group;
}

export interface IFloatingModelState extends IModelState {
  modelIndex: number;
}
