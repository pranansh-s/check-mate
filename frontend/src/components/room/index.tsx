'use client';

import { useCallback, useEffect } from 'react';

import { Game, GameServer, Room } from '@/types';
import { collection, limit, onSnapshot, query, where } from 'firebase/firestore';
import tw from 'tailwind-styled-components';

import { auth, db } from '@/lib/firebase';
import { parseGame, updatePlayerSide } from '@/lib/utils/game';
import { goToMove, initMoves, movePiece } from '@/redux/features/boardSlice';
import { beginTurn, initGameState } from '@/redux/features/gameSlice';
import { closeModal, openModal } from '@/redux/features/modalSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

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
  const user = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  const initGame = useCallback(
    (currentGame: Game) => {
      dispatch(initMoves(currentGame.moves));
      dispatch(initGameState(currentGame));
    },
    [dispatch]
  );

  useEffect(() => {
    if (!user) return;

    if (game) {
      initGame(game);
    } else if (room.createdBy === auth.currentUser!.uid) {
      dispatch(openModal('gameSettings'));
    } else {
      dispatch(openModal('waiting'));
    }
  }, [dispatch, game, user]);

  useEffect(() => {
    const gamesQuery = query(
      collection(db, 'games'),
      where('roomId', '==', roomId),
      where('active', '==', true),
      limit(1)
    );
    const gameUnsubscribe = onSnapshot(
      gamesQuery,
      snapshot => {
        if (snapshot.empty) return;
        snapshot.docChanges().forEach(async change => {
          const gameDoc = change.doc;
          const gameData = gameDoc.data() as GameServer;
          const parsedGame = parseGame(gameDoc.id, auth.currentUser!.uid, gameData);

          if (change.type === 'added') {
            await updatePlayerSide(gameDoc.id, gameData, auth.currentUser!.uid);
            if (!game) {
              initGame(parsedGame);
              dispatch(closeModal());
            }
          } else if (change.type === 'modified' && parsedGame.playerSide === parsedGame.playerTurn) {
            const opponentMove = parsedGame.moves.at(-1);
            if (opponentMove) {
              dispatch(movePiece(opponentMove));
              dispatch(goToMove(parsedGame.moves.length));
              dispatch(beginTurn());
            }
          }
        });
      },
      err => {
        console.log('game listening error: ', err);
      }
    );

    return gameUnsubscribe;
  }, [roomId]);

  return (
    <RoomContainer>
      {activeModal === 'gameSettings' && <GameSettings roomId={roomId} />}
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
