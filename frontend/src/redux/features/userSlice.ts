import { UserProfile } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: null as UserProfile | null,
  reducers: {
    onLogin: (_, action: PayloadAction<UserProfile>) => {
      return action.payload;
    },
    onLogout: () => {
      return null;
    },
    onUpdate: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state) {
        return {
          ...state,
          ...action.payload,
        };
      }
      return state;
    },
  },
});

export const { onLogin, onLogout, onUpdate } = userSlice.actions;

export default userSlice.reducer;
