import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import { storeCartItems } from '../utils/cartStorage';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

store.subscribe(() => {
  storeCartItems(store.getState().cart.cartItems);
});
