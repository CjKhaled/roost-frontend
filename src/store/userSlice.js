// src/store/userSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // Will hold user data matching the schema
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Action to log in a user and set user data
    login: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload; // action.payload should contain user data
    },
    // Action to log out a user and clear user data
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
    },
    // Action to update user fields
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { login, logout, updateUser } = userSlice.actions;
export default userSlice.reducer;
