import { createSlice } from '@reduxjs/toolkit';
import { getStoredCartItems } from '../utils/cartStorage';

const initialState = {
  cartItems: getStoredCartItems(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    consumeEnquiredItems: (state, action) => {
      for (const sent of action.payload) {
        const item = state.cartItems.find((entry) => entry._id === sent._id);
        if (item) item.quantity = Math.max(0, item.quantity - sent.quantity);
      }
      state.cartItems = state.cartItems.filter((item) => item.quantity > 0);
    },
    addToCart: (state, action) => {
      const existingItem = state.cartItems.find(item => item._id === action.payload._id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.cartItems.push({ ...action.payload });
      }
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(item => item._id !== action.payload);
    },
    updateQuantity: (state, action) => {
      const item = state.cartItems.find(item => item._id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, consumeEnquiredItems } = cartSlice.actions;

export default cartSlice.reducer;
