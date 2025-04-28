import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  toasts: []
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    addToast: (state, action) => {
      state.toasts.push({
        id: Date.now(),
        message: action.payload.message,
        type: action.payload.type
      });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    }
  }
});

export const { addToast, removeToast } = toastSlice.actions;
export default toastSlice.reducer;