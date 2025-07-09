import { configureStore } from '@reduxjs/toolkit';

import boardReducer from './features/boardSlice';
import gameReducer from './features/gameSlice';
import modalReducer from './features/modalSlice';
import userReducer from './features/userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    board: boardReducer,
    gameState: gameReducer,
    modals: modalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
