import { ChatMessage, Game, GameConfig, Move } from '@check-mate/shared/types';
import { io } from 'socket.io-client';

import { showErrorToast } from '@/components/common/ErrorToast';

import { initMoves, movePiece } from '@/redux/features/boardSlice';
import { addMessage } from '@/redux/features/chatSlice';
import { endTurn, initGameState } from '@/redux/features/gameSlice';
import { closeModal } from '@/redux/features/modalSlice';
import { AppDispatch } from '@/redux/store';

const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL);

const SocketService = {
  initSocket: (roomId: string, userId: string, dispatch: AppDispatch) => {
    socket.on('error', (message: string) => {
      showErrorToast('Failed to process task', message);
    });

    socket.on('receiveChatMessage', (newChatMessage: ChatMessage) => {
      dispatch(addMessage(newChatMessage));
    });

    socket.on('gameJoined', (joinedGame: Game) => {
      SocketService.initGame(dispatch, joinedGame);
    });

    socket.on('moveUpdate', (move: Move) => {
      dispatch(movePiece(move));
      dispatch(endTurn());
    });

    socket.emit('joinRoom', roomId, userId);
  },

  initGame: (dispatch: AppDispatch, game: Game) => {
    dispatch(initMoves(game.moves));
    dispatch(initGameState(game));
    dispatch(closeModal());
  },

  sendMessage: (message: string) => {
    socket.emit('sendChatMessage', message);
  },

  newGame: (config: GameConfig) => {
    socket.emit('newGame', config);
  },

  makeMove: (move: Move) => {
    socket.emit('newMove', move);
  },

  leaveRoom: () => {
    socket.disconnect();
  },
};

export default SocketService;
