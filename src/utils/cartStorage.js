const CART_STORAGE_KEY = '3mt_cart_items';

const canUseStorage = () =>
  typeof window !== 'undefined' && Boolean(window.localStorage);

export const getStoredCartItems = () => {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
    const parsedCart = storedCart ? JSON.parse(storedCart) : [];

    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch (error) {
    window.localStorage.removeItem(CART_STORAGE_KEY);
    return [];
  }
};

export const storeCartItems = (cartItems) => {
  if (!canUseStorage()) {
    return;
  }

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    window.localStorage.removeItem(CART_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
};
