import { Game, Room } from '.';

export interface GetRoomResponse {
  room: Room;
  game: Game | null;
}

export interface CreateRoomResponse {
  key: string;
}
