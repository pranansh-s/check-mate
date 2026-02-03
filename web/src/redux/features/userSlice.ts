import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Profile } from '@xhess/shared/schemas';

const userSlice = createSlice({
  name: 'user',
  initialState: null as Profile | null,
  reducers: {
    onLogin: (_, action: PayloadAction<Profile>) => {
      return action.payload;
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

    onLogout: () => {
      return null;
    },
  },
});

export const { onLogin, onUpdate, onLogout } = userSlice.actions;

export default userSlice.reducer;
