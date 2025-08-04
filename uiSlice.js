import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  imagePreview: null,
  showImagePreview: false,
  isLogin: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setImagePreview: (state, action) => {
      state.imagePreview = action.payload;
    },
    setShowImagePreview: (state, action) => {
      state.showImagePreview = action.payload;
    },
    clearImagePreview: (state) => {
      state.imagePreview = null;
      state.showImagePreview = false;
    },
    toggleAuthMode: (state) => {
      state.isLogin = !state.isLogin;
    },
    setAuthMode: (state, action) => {
      state.isLogin = action.payload;
    },
  },
});

export const { 
  setImagePreview, 
  setShowImagePreview, 
  clearImagePreview, 
  toggleAuthMode, 
  setAuthMode 
} = uiSlice.actions;

export default uiSlice.reducer; 