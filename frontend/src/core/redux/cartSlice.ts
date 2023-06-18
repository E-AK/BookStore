import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import CartItem from '../models/CartItem';

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const { bookId, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.bookId === bookId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      const bookId = action.payload;
      state.items = state.items.filter((item) => item.bookId !== bookId);
    },
    updateCartItemQuantity: (state, action: PayloadAction<{ bookId: number; quantity: number }>) => {
      const { bookId, quantity } = action.payload;
      const item = state.items.find((item) => item.bookId === bookId);
      if (item) {
        item.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateCartItemQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
