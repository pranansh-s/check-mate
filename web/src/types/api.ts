import { Profile } from '@check-mate/shared/schemas';
import { Game, Room } from '@check-mate/shared/types';

export interface GetRoomResponse {
  room: Room;
  game: Game | null;
  opponentProfile: Profile | null;
}

export interface CreateRoomResponse {
  key: string;
}