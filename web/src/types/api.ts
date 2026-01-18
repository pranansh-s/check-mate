import { Game, Room } from '@check-mate/shared/types';

export interface GetRoomResponse {
  room: Room;
  game: Game | null;
}

export interface CreateRoomResponse {
  key: string;
}