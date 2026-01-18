import UserService from '@/services/user.service';
import { Color, Game, GameType, PlayerState } from '@check-mate/shared/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  isTurn: true,
  isPlaying: false,
  playerSide: 'white' as Color,
  gameType: '30m' as GameType,
  players: {
    whiteSidePlayer: null as PlayerState | null,
    blackSidePlayer: null as PlayerState | null,
  }
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    initGameState: (_, action: PayloadAction<Game>) => {
      const { playerTurn, whiteSidePlayer, blackSidePlayer, gameType } = action.payload;
      const userId = UserService.getUserId();
      if (!userId) return;

      let playerSide: Color;
      if (whiteSidePlayer?.userId === userId) {
        playerSide = 'white';
      } else if (blackSidePlayer?.userId === userId) {
        playerSide = 'black';
      } else return;

      return {
        isTurn: playerSide == playerTurn,
        playerSide,
        gameType,
        isPlaying: true,
        players: {
          whiteSidePlayer,
          blackSidePlayer
        }
      };
    },

    whitePlayerUpdate: (state, action: PayloadAction<PlayerState>) => {
      state.players.whiteSidePlayer = action.payload;
    },

    blackPlayerUpdate: (state, action: PayloadAction<PlayerState>) => {
      state.players.blackSidePlayer = action.payload;
    },

    endTurn: state => {
      state.isTurn = !state.isTurn;
    },
  },
});

export const { initGameState, whitePlayerUpdate, blackPlayerUpdate, endTurn } = gameSlice.actions;

export default gameSlice.reducer;
