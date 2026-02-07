import { useEffect } from 'react';

import SocketService from '@/services/socket.service';
import UserService from '@/services/user.service';

import { Room } from '@xhess/shared/types';

import { initMessages } from '@/redux/features/chatSlice';
import { openModal } from '@/redux/features/modalSlice';
import { useAppDispatch } from '@/redux/hooks';

const useRoomInit = (currentRoomId: string, currentRoom: Room) => {
  const userId = UserService.getUserId();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!userId || !currentRoomId) return;

    SocketService.initSocket(currentRoomId, userId, dispatch);
    dispatch(initMessages(currentRoom.chat));

    const isOwner = currentRoom.createdBy === userId;
    dispatch(openModal(isOwner ? 'gameSettings' : 'waiting'));

    return SocketService.leaveRoom;
  }, [currentRoomId, userId, currentRoom, dispatch]);
};

export default useRoomInit;
