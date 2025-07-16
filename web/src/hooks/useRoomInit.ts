import { useEffect } from 'react';

import { Game, Room } from '@check-mate/shared/types';

import { initMoves } from '@/redux/features/boardSlice';
import { initGameState } from '@/redux/features/gameSlice';
import { openModal } from '@/redux/features/modalSlice';
import { useAppDispatch } from '@/redux/hooks';

const useRoomInit = (currentRoom: Room, existingGame: Game | null, userId?: string) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!userId) return;

    if (existingGame) {
      dispatch(initMoves(existingGame.moves));
      dispatch(initGameState(existingGame));
      return;
    }

    const isOwner = currentRoom.createdBy === userId;
    dispatch(openModal(isOwner ? 'gameSettings' : 'waiting'));
  }, [existingGame, userId, dispatch]);
};

export default useRoomInit;
