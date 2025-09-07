import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import mediaSlice from './slices/mediaSlice';
import subscriptionSlice from './slices/subscriptionSlice';
import uiSlice from './slices/uiSlice';
import adminSlice from './slices/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    media: mediaSlice,
    subscriptions: subscriptionSlice,
    ui: uiSlice,
    admin: adminSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});