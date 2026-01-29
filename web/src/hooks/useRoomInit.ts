import { useEffect } from 'react';

import SocketService from '@/services/socket.service';
import { Game, Room } from '@check-mate/shared/types';

import { initMessages } from '@/redux/features/chatSlice';
import { openModal } from '@/redux/features/modalSlice';
import { useAppDispatch } from '@/redux/hooks';
import UserService from '@/services/user.service';
import { Profile } from '@check-mate/shared/schemas';

const useRoomInit = (currentRoomId: string, currentRoom: Room, existingGame: Game | null, opponentProfile: Profile | null) => {
  const userId = UserService.getUserId();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!userId || !currentRoomId) return;

    SocketService.initSocket(currentRoomId, userId, dispatch);
    dispatch(initMessages(currentRoom.chat));

    console.log(currentRoom, existingGame);

    if (existingGame) {
      SocketService.initGame(dispatch, existingGame, opponentProfile);
      return;
    }

    const isOwner = currentRoom.createdBy === userId;
    dispatch(openModal(isOwner ? 'gameSettings' : 'waiting'));

    return SocketService.leaveRoom;
  }, [currentRoomId, userId]);
};

export default useRoomInit;
