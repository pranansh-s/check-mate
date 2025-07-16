import { Profile } from '@check-mate/shared/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: null as Profile | null,
  reducers: {
    onLogin: (_, action: PayloadAction<Profile>) => {
      return action.payload;
    },

    onLogout: () => {
      return null;
    },

    onUpdate: (state, action: PayloadAction<Partial<Profile>>) => {
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
