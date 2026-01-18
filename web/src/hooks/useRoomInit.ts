import { useEffect } from 'react';

import SocketService from '@/services/socket.service';
import { Game, Room } from '@check-mate/shared/types';

import { initMoves } from '@/redux/features/boardSlice';
import { initMessages } from '@/redux/features/chatSlice';
import { initGameState } from '@/redux/features/gameSlice';
import { openModal } from '@/redux/features/modalSlice';
import { useAppDispatch } from '@/redux/hooks';

const useRoomInit = (currentRoomId: string, currentRoom: Room, existingGame: Game | null, userId?: string) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!userId || !currentRoomId) return;

    SocketService.initSocket(currentRoomId, userId, dispatch);
    dispatch(initMessages(currentRoom.chat));

    if (existingGame) {
      dispatch(initMoves(existingGame.moves));
      dispatch(initGameState(existingGame));
      return;
    }

    const isOwner = currentRoom.createdBy === userId;
    dispatch(openModal(isOwner ? 'gameSettings' : 'waiting'));

    return SocketService.leaveRoom;
  }, [currentRoomId, userId]);
};

export default useRoomInit;
