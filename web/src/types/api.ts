import { Game, Room } from '@xhess/shared/types';

export interface GetRoomResponse {
  room: Room;
}

export interface CreateRoomResponse {
  key: string;
}
