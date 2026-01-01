import { GameType } from '@check-mate/shared/types';
import { Group } from 'three';

export type ModalType = 'gameSettings' | 'joinRoom' | 'waiting' | null;

export interface GameTypeOption {
  name: string;
  type: GameType;
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
