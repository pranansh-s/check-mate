import { Game, PieceColor } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  id: null as string | null,
  isTurn: true,
  playerSide: 'white' as PieceColor,
  gameType: '30m',
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    initGameState: (_, action: PayloadAction<Game>) => {
      const { id, playerTurn, playerSide, gameType } = action.payload;
      return {
        id,
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
