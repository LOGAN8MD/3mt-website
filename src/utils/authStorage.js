export const AUTH_TOKEN_STORAGE_KEY = 'threeMtCustomerToken';
export const AUTH_USER_STORAGE_KEY = 'threeMtCustomerUser';

export const getStoredAuthToken = () =>
  window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

export const getStoredAuthUser = () => {
  const storedUser = window.localStorage.getItem(AUTH_USER_STORAGE_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    return null;
  }
};

export const storeAuthSession = ({ token, ...user }) => {
  if (token) {
    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  }

  window.localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
};

export const clearStoredAuthSession = () => {
  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
};
