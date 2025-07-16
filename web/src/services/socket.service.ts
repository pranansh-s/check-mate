import { ChatMessage, Game, GameConfig, Move, Room } from '@check-mate/shared/types';
import { io } from 'socket.io-client';

import { showErrorToast } from '@/components/common/ErrorToast';

import { initMoves } from '@/redux/features/boardSlice';
import { initGameState } from '@/redux/features/gameSlice';
import { closeModal } from '@/redux/features/modalSlice';
import { AppDispatch } from '@/redux/store';

const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL);

const SocketService = {
  initListeners: (dispatch: AppDispatch) => {
    socket.on('error', (message: string) => {
      showErrorToast('Failed to process task', message);
    });

    socket.on('recieveChatMessage', (newChatMessage: ChatMessage) => {});

    socket.on('gameCreated', SocketService.joinGame);

    socket.on('gameJoined', (joinedGame: Game) => {
      dispatch(initMoves(joinedGame.moves));
      dispatch(initGameState(joinedGame));
      dispatch(closeModal());
    });

    socket.on('gameUpdate', (updatedGame: Game) => {});

    socket.on('roomUpdate', (updatedRoom: Room) => {});
  },

  connectToRoom: (roomId: string, userId: string) => {
    socket.emit('joinRoom', roomId, userId);
  },

  sendMessage: (message: string) => {
    socket.emit('sendChatMessage', message);
  },

  newGame: (config: GameConfig) => {
    socket.emit('newGame', config);
  },

  joinGame: () => {
    socket.emit('joinGame');
  },

  makeMove: (move: Move) => {
    socket.emit('newMove', move);
  },

  leaveRoom: () => {
    socket.emit('disconnect');
  },
};

export default SocketService;
