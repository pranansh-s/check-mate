import UserService from '@/services/user.service';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Profile } from '@xhess/shared/schemas';
import { Color, Game, GameType, PlayerState } from '@xhess/shared/types';

const initialState = {
  isTurn: true,
  isPlaying: false,
  playerSide: 'white' as Color,
  gameType: '30m' as GameType,
  players: {
    whiteSidePlayer: null as PlayerState | null,
    blackSidePlayer: null as PlayerState | null,
  },
  opponentProfile: null as Profile | null,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    initGameState: (_, action: PayloadAction<Game>) => {
      const { playerTurn, state, whiteSidePlayer, blackSidePlayer, gameType } = action.payload;
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
        isPlaying: state == 'isPlaying',
        players: {
          whiteSidePlayer,
          blackSidePlayer,
        },
        opponentProfile: null,
      };
    },

    whitePlayerUpdate: (state, action: PayloadAction<PlayerState>) => {
      state.players.whiteSidePlayer = action.payload;
    },

    blackPlayerUpdate: (state, action: PayloadAction<PlayerState>) => {
      state.players.blackSidePlayer = action.payload;
    },

    setOpponentProfile: (state, action: PayloadAction<Profile | null>) => {
      state.opponentProfile = action.payload;
    },

    endTurn: state => {
      state.isTurn = !state.isTurn;
    },
  },
});

export const { initGameState, whitePlayerUpdate, setOpponentProfile, blackPlayerUpdate, endTurn } = gameSlice.actions;

export default gameSlice.reducer;
