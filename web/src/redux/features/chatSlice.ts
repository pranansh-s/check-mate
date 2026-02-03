import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ChatMessage } from '@xhess/shared/types';

const chatSlice = createSlice({
  name: 'chat',
  initialState: [] as (ChatMessage | string)[],
  reducers: {
    initMessages: (_, action: PayloadAction<ChatMessage[]>) => {
      return action.payload;
    },

    addMessage: (state, action: PayloadAction<ChatMessage | string>) => {
      return [...state, action.payload];
    },
  },
});

export const { initMessages, addMessage } = chatSlice.actions;

export default chatSlice.reducer;
