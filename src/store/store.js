// src/store/store.js

import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import userReducer from './userSlice';
import listingsReducer from './listingsSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'listings'],
};

const rootReducer = combineReducers({
  user: userReducer,
  listings: listingsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
export default store;
