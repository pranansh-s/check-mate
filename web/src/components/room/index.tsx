'use client';

import { Game, Room } from '@check-mate/shared/types';
import tw from 'tailwind-styled-components';

import { getUserId } from '@/lib/utils/user';
import useRoomInit from '@/hooks/useRoomInit';
import useSocketInit from '@/hooks/useSocketInit';
import { useAppSelector } from '@/redux/hooks';

import GameBar from '../game-bar';
import GameSettings from '../modals/GameSettings';
import Waiting from '../modals/Waiting';
import Board from './Board';

interface IRoomProps {
  roomId: string;
  room: Room;
  game: Game | null;
}

const RoomClient: React.FC<IRoomProps> = ({ roomId, room, game }) => {
  const activeModal = useAppSelector(state => state.modals);
  const userId = getUserId();

  useRoomInit(room, game, userId);
  useSocketInit(roomId, userId);

  // useEffect(() => {
  //   const gamesQuery = query(
  //     collection(db, 'games'),
  //     where('roomId', '==', roomId),
  //     where('active', '==', true),
  //     limit(1)
  //   );
  //   const gameUnsubscribe = onSnapshot(
  //     gamesQuery,
  //     snapshot => {
  //       if (snapshot.empty) return;
  //       snapshot.docChanges().forEach(async change => {
  //         const gameDoc = change.doc;
  //         const gameData = gameDoc.data() as Game;
  //         const parsedGame = parseGame(gameDoc.id, auth.currentUser!.uid, gameData);
  //         if (change.type === 'added') {
  //           await updatePlayerSide(gameDoc.id, gameData, auth.currentUser!.uid);
  //           if (!game) {
  //             initGame(parsedGame);
  //             dispatch(closeModal());
  //           }
  //         } else if (change.type === 'modified' && parsedGame.playerSide === parsedGame.playerTurn) {
  //           const opponentMove = parsedGame.moves.at(-1);
  //           if (opponentMove) {
  //             dispatch(movePiece(opponentMove));
  //             dispatch(goToMove(parsedGame.moves.length));
  //             dispatch(beginTurn());
  //           }
  //         }
  //       });
  //     },
  //     err => {
  //       console.log('game listening error: ', err);
  //     }
  //   );
  //   return gameUnsubscribe;
  // }, [roomId]);

  return (
    <RoomContainer>
      {activeModal === 'gameSettings' && <GameSettings />}
      {activeModal === 'waiting' && <Waiting />}
      <Board />
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
  p-10
`;
