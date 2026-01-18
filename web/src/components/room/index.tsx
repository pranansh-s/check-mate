'use client';

import UserService from '@/services/user.service';
import { Game, Room } from '@check-mate/shared/types';
import tw from 'tailwind-styled-components';

import useRoomInit from '@/hooks/useRoomInit';
import { useAppSelector } from '@/redux/hooks';

import GameBar from '../game-bar';
import GameSettings from '../modals/GameSettings';
import Waiting from '../modals/Waiting';
import GameUI from './GameUI';

interface IRoomProps {
  roomId: string;
  room: Room;
  game: Game | null;
}

const RoomClient: React.FC<IRoomProps> = ({ roomId, room, game }) => {
  const activeModal = useAppSelector(state => state.modals);
  const userId = UserService.getUserId();

  useRoomInit(roomId, room, game, userId);

  return (
    <RoomContainer>
      {activeModal === 'gameSettings' && <GameSettings />}
      {activeModal === 'waiting' && <Waiting />}
      <GameUI />
      <GameBar />
    </RoomContainer>
  );
};

export default RoomClient;

const RoomContainer = tw.div`
  flex
  h-screen
  items-center
  justify-center
  gap-10
  p-20
`;