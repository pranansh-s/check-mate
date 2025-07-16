import { useEffect } from 'react';

import SocketService from '@/services/socket.service';

import { useAppDispatch } from '@/redux/hooks';

const useSocketInit = (roomId: string, userId?: string) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const connectSocket = () => {
      if (!userId) return;
      SocketService.initListeners(dispatch);
      SocketService.connectToRoom(roomId, userId);
    };

    connectSocket();
    return SocketService.leaveRoom;
  }, [roomId, userId, dispatch]);
};

export default useSocketInit;
