import UserService from '@/services/user.service';
import { Color, Game, GameType } from '@check-mate/shared/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  isTurn: true,
  playerSide: 'white' as Color,
  gameType: '30m' as GameType,
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
      };
    },

    endTurn: state => {
      state.isTurn = false;
    },

    beginTurn: state => {
      state.isTurn = true;
    },
  },
});

export const { initGameState, endTurn, beginTurn } = gameSlice.actions;

export default gameSlice.reducer;
