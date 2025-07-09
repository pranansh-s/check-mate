import { ModalType } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modals',
  initialState: null as ModalType,
  reducers: {
    openModal: (_, action: PayloadAction<ModalType>) => {
      return action.payload;
    },
    closeModal() {
      return null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
