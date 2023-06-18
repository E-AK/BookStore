import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import purchaseHistoryReducer from './purchaseHistorySlice';
import bookReducer from './bookSlice';
import usersReducer from './usersSlice';
import cartReducer from './cartSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    purchaseHistory: purchaseHistoryReducer,
    book: bookReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
