'use client';

import UserService from '@/services/user.service';
import { Game, Room } from '@check-mate/shared/types';
import tw from 'tailwind-styled-components';

import useRoomInit from '@/hooks/useRoomInit';
import { useAppSelector } from '@/redux/hooks';

import GameBar from '../game-bar';
import GameSettings from '../modals/GameSettings';
import Waiting from '../modals/Waiting';
import Board from './Board';
import UserBar from './user-bar';

interface IRoomProps {
  roomId: string;
  room: Room;
  game: Game | null;
}

const RoomClient: React.FC<IRoomProps> = ({ roomId, room, game }) => {
  const activeModal = useAppSelector(state => state.modals);
  const { playerSide, players } = useAppSelector(state => state.gameState);
  const userId = UserService.getUserId();

  useRoomInit(roomId, room, game, userId);

  return (
    <RoomContainer>
      {activeModal === 'gameSettings' && <GameSettings />}
      {activeModal === 'waiting' && <Waiting />}
      <GameContainer>
        <UserBar user={playerSide == 'white' ? players.blackSidePlayer : players.whiteSidePlayer} isUser={false} />
        <Board />
        <UserBar user={playerSide == 'white' ? players.whiteSidePlayer : players.blackSidePlayer} isUser={true} />
      </GameContainer>
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

const GameContainer = tw.div`
  flex
  h-full
  flex-col
  justify-center
  space-y-3
`;
