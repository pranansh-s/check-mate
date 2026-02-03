import { Game, Room } from '@check-mate/shared/types';

export interface GetRoomResponse {
  room: Room;
}

export interface CreateRoomResponse {
  key: string;
}