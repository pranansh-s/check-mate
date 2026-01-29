import { ChatMessage, Game, GameConfig, GameState, Move } from '@check-mate/shared/types';
import { io } from 'socket.io-client';

import { showErrorToast } from '@/components/common/ErrorToast';

import { initMoves, movePiece } from '@/redux/features/boardSlice';
import { addMessage } from '@/redux/features/chatSlice';
import { blackPlayerUpdate, endTurn, initGameState, setOpponentProfile, whitePlayerUpdate } from '@/redux/features/gameSlice';
import { closeModal } from '@/redux/features/modalSlice';
import { AppDispatch } from '@/redux/store';
import { Profile } from '@check-mate/shared/schemas';

const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL);

const SocketService = {
  initSocket: (roomId: string, userId: string, dispatch: AppDispatch) => {
    socket.on('error', (message: string) => {
      showErrorToast('Failed to process task', message);
    });

    socket.on('receiveChatMessage', (newChatMessage: ChatMessage) => {
      dispatch(addMessage(newChatMessage));
    });

    socket.on('gameJoined', (joinedGame: Game, opponentProfile: Profile | null) => {
      SocketService.initGame(dispatch, joinedGame, opponentProfile);
    });

    socket.on('moveUpdate', (game: Game) => {
      const move = game.moves.at(-1);
      if(!move) {
        throw new Error("No move to update");
      }

      SocketService.updatePlayerState(dispatch, game);
      dispatch(movePiece(move));
      dispatch(endTurn());
    });

    socket.emit('joinRoom', roomId, userId);
  },

  initGame: (dispatch: AppDispatch, game: Game, profile: Profile | null) => {
    
    SocketService.updatePlayerState(dispatch, game);
    dispatch(initMoves(game.moves));
    dispatch(initGameState(game));
    if(profile) {
      dispatch(setOpponentProfile(profile));
    }
    dispatch(closeModal());
  },

  updatePlayerState: (dispatch: AppDispatch, game: Game) => {
    if(game.whiteSidePlayer) {
      dispatch(whitePlayerUpdate(game.whiteSidePlayer));
    }
    if(game.blackSidePlayer) {
      dispatch(blackPlayerUpdate(game.blackSidePlayer));
    }
  },

  endGame: (state: GameState) => {
    socket.emit('newGameState', state);
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
