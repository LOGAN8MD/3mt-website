import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  clearStoredAuthSession,
  getStoredAuthToken,
  getStoredAuthUser,
  storeAuthSession,
} from '../utils/authStorage';
import {
  getMyProfile,
  googleLoginCustomer,
  loginCustomer,
  registerCustomer,
  resendRegistrationOtp,
  updateMyProfile,
  verifyRegistrationOtp,
} from '../services/authApi';
import { isWebsiteAllowedRole } from '../utils/roles';

const AuthContext = createContext(null);

const hasToken = () => Boolean(getStoredAuthToken());

const ensureWebsiteUserRole = (authUser) => {
  if (!isWebsiteAllowedRole(authUser?.role)) {
    throw new Error('This account role is not allowed on the 3MT website.');
  }

  return authUser;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredAuthUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [pendingAction, setPendingAction] = useState(null);

  const persistUser = useCallback((authResponse) => {
    const { token, ...authUser } = authResponse;
    const nextUser = ensureWebsiteUserRole(authUser);
    storeAuthSession({ ...nextUser, token });
    setUser(nextUser);
    return nextUser;
  }, []);

  const completeAuth = useCallback(
    async (authResponse) => {
      const nextUser = persistUser(authResponse);
      setIsAuthModalOpen(false);

      if (pendingAction) {
        const action = pendingAction;
        setPendingAction(null);
        await action(nextUser);
      }
    },
    [pendingAction, persistUser]
  );

  const openAuthModal = useCallback((mode = 'login', action = null) => {
    setAuthModalMode(mode);
    setPendingAction(() => action);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setPendingAction(null);
  }, []);

  const requireAuth = useCallback(
    (action) => {
      if (user && hasToken()) {
        return action(user);
      }

      openAuthModal('login', action);
      return undefined;
    },
    [openAuthModal, user]
  );

  const logout = useCallback(() => {
    clearStoredAuthSession();
    setUser(null);
    setPendingAction(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!hasToken()) {
      return null;
    }

    const profile = await getMyProfile();
    ensureWebsiteUserRole(profile);
    const token = getStoredAuthToken();
    storeAuthSession({ ...profile, token });
    setUser(profile);
    return profile;
  }, []);

  const updateProfile = useCallback(async (payload) => {
    const profile = await updateMyProfile(payload);
    ensureWebsiteUserRole(profile);
    const token = getStoredAuthToken();
    storeAuthSession({ ...profile, token });
    setUser(profile);
    return profile;
  }, []);

  useEffect(() => {
    if (!hasToken()) {
      return;
    }

    refreshProfile().catch(() => {
      clearStoredAuthSession();
      setUser(null);
    });
  }, [refreshProfile]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user && hasToken()),
      isAuthModalOpen,
      authModalMode,
      openAuthModal,
      closeAuthModal,
      requireAuth,
      completeAuth,
      login: loginCustomer,
      register: registerCustomer,
      verifyOtp: verifyRegistrationOtp,
      resendOtp: resendRegistrationOtp,
      googleLogin: googleLoginCustomer,
      updateProfile,
      logout,
      setAuthModalMode,
    }),
    [
      authModalMode,
      closeAuthModal,
      completeAuth,
      isAuthModalOpen,
      logout,
      openAuthModal,
      requireAuth,
      updateProfile,
      user,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};
