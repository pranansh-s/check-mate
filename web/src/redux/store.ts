import { configureStore } from '@reduxjs/toolkit';

import userReducer from './features/userSlice';
import boardReducer from './features/boardSlice';
import gameReducer from './features/gameSlice';
import chatReducer from './features/chatSlice';
import modalReducer from './features/modalSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    board: boardReducer,
    gameState: gameReducer,
    chatState: chatReducer,
    modals: modalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
