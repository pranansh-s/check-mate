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

export type GameType = '30m' | '10m' | '3m';

export type BoardMap = (Piece | null)[][];

export type Result = 'white' | 'black' | 'draw';

export interface Piece {
  src: string;
  type: PieceType;
  color: PieceColor;
  pos: Position;
}

export interface UserProfile {
  email: string;
  displayName: string;
  createdAt: number;
}

export interface Room {
  participants: string[];
  createdBy: string;
  chat?: string[];
}

export interface GameServer extends GameConfig {
  roomId: string;
  moves: Move[];
  playerTurn: PieceColor;
  result: Result;
  active: boolean;
}

export interface Game extends Omit<GameConfig, 'whiteSidePlayer' | 'blackSidePlayer'> {
  id: string;
  roomId: string;
  moves: Move[];
  playerTurn: PieceColor;
  playerSide: PieceColor;
}

export interface GameConfig {
  whiteSidePlayer: string | null;
  blackSidePlayer: string | null;
  gameType: GameType;
}

export interface Message {
  content: string;
  senderId: string;
  timestamp: number;
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
