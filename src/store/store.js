// \src\store\store.js

import { configureStore, createSlice } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

const authSlice = createSlice({
  name: 'auth',
  initialState: { isLoggedIn: false },
  reducers: {
    login: (state) => { state.isLoggedIn = true; },
    logout: (state) => { state.isLoggedIn = false; }
  }
});

export const { login, logout } = authSlice.actions;

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const rootReducer = combineReducers({
  auth: authSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
export default store;
