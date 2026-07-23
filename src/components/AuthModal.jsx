import { useCallback, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GoogleSignInButton from './GoogleSignInButton';
import {
  requestPasswordReset,
  resetPassword,
  verifyPasswordResetOtp,
} from '../services/authApi';

const initialRegisterForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  address: '',
};

function AuthModal() {
  const {
    authModalMode,
    closeAuthModal,
    completeAuth,
    googleLogin,
    isAuthModalOpen,
    login,
    register,
    resendOtp,
    setAuthModalMode,
    verifyOtp,
  } = useAuth();

  const [loginForm, setLoginForm] = useState({ identifier: '', password: '' });
  const [registerForm, setRegisterForm] = useState(initialRegisterForm);
  const [resetEmail, setResetEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [resetPasswordForm, setResetPasswordForm] = useState({
    password: '',
    confirmPassword: '',
  });
  const [otpState, setOtpState] = useState(null);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthModalOpen) {
      setError('');
      setInfo('');
    }
  }, [authModalMode, isAuthModalOpen]);

  const getModalTitle = () => {
    if (authModalMode === 'register') return 'Create account';
    if (authModalMode === 'otp') return 'Verify OTP';
    if (authModalMode === 'forgotPassword') return 'Forgot password';
    if (authModalMode === 'resetOtp') return 'Verify reset OTP';
    if (authModalMode === 'resetPassword') return 'Set new password';
    return 'Login';
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await login(loginForm);
      await completeAuth(response);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setInfo('');

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!registerForm.firstName.trim()) {
      setError('First name is required');
      return;
    }

    if (!registerForm.email.trim()) {
      setError('Email is required for email OTP');
      return;
    }

    setIsSubmitting(true);

    try {
      const firstName = registerForm.firstName.trim();
      const lastName = registerForm.lastName.trim();
      const name = [firstName, lastName].filter(Boolean).join(' ');
      const response = await register({
        name,
        firstName,
        lastName,
        email: registerForm.email || undefined,
        phone: registerForm.phone || undefined,
        password: registerForm.password,
        address: registerForm.address,
        verificationMethod: 'email',
      });

      if (response.token) {
        await completeAuth(response);
        return;
      }

      setOtpState(response);
      setAuthModalMode('otp');
      setInfo(
        response.devOtp
          ? `Development OTP: ${response.devOtp}`
          : `OTP sent to ${response.destination}`
      );
    } catch (err) {
      if (err.response?.data?.debug) {
        console.group('3MT registration debug');
        console.log(err.response.data.debug);
        console.groupEnd();
      }

      setError(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await verifyOtp({ userId: otpState.userId, otp });
      await completeAuth(response);
    } catch (err) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (!otpState?.userId) return;

    setError('');
    setInfo('');
    setIsSubmitting(true);

    try {
      const response = await resendOtp({ userId: otpState.userId });
      setOtpState(response);
      setInfo(
        response.devOtp
          ? `Development OTP: ${response.devOtp}`
          : `OTP resent to ${response.destination}`
      );
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPasswordSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setInfo('');
    setIsSubmitting(true);

    try {
      const response = await requestPasswordReset({ email: resetEmail });
      setInfo(
        response.devOtp
          ? `Development OTP: ${response.devOtp}`
          : response.message || 'If this email is registered, password reset instructions have been sent.'
      );
      setAuthModalMode('resetOtp');
    } catch (err) {
      setError(err.message || 'Failed to request password reset');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetOtpSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setInfo('');
    setIsSubmitting(true);

    try {
      const response = await verifyPasswordResetOtp({
        email: resetEmail,
        otp: resetOtp,
      });
      setResetToken(response.resetToken);
      setInfo(response.message || 'OTP verified. Set a new password.');
      setAuthModalMode('resetPassword');
    } catch (err) {
      setError(err.message || 'Password reset OTP verification failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPasswordSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setInfo('');

    if (resetPasswordForm.password !== resetPasswordForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await resetPassword({
        resetToken,
        password: resetPasswordForm.password,
      });
      setInfo(response.message || 'Password reset successfully. Please log in.');
      setLoginForm({ identifier: resetEmail, password: '' });
      setResetOtp('');
      setResetToken('');
      setResetPasswordForm({ password: '', confirmPassword: '' });
      setAuthModalMode('login');
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleCredential = useCallback(async (credential) => {
    setError('');
    setIsSubmitting(true);

    try {
      const response = await googleLogin({ credential });
      await completeAuth(response);
    } catch (err) {
      setError(err.message || 'Google login failed');
    } finally {
      setIsSubmitting(false);
    }
  }, [completeAuth, googleLogin]);

  if (!isAuthModalOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-yellow-700">
              Customer Account
            </p>
            <h2 className="text-2xl font-black text-gray-900">
              {getModalTitle()}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close account modal"
            onClick={closeAuthModal}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {['login', 'register'].includes(authModalMode) && (
          <div className="mb-4">
            <GoogleSignInButton onCredential={handleGoogleCredential} disabled={isSubmitting} />
            <div className="my-4 flex items-center gap-3 text-xs uppercase tracking-widest text-gray-400">
              <span className="h-px flex-1 bg-gray-200" />
              or
              <span className="h-px flex-1 bg-gray-200" />
            </div>
          </div>
        )}

        {error && <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {info && <p className="mb-4 rounded-md bg-yellow-50 px-3 py-2 text-sm text-yellow-800">{info}</p>}

        {authModalMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <input
              type="text"
              value={loginForm.identifier}
              onChange={(event) => setLoginForm({ ...loginForm, identifier: event.target.value })}
              placeholder="Email or phone"
              className="w-full rounded-md border border-gray-300 px-3 py-3 outline-none focus:border-yellow-500"
              required
            />
            <input
              type="password"
              value={loginForm.password}
              onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
              placeholder="Password"
              className="w-full rounded-md border border-gray-300 px-3 py-3 outline-none focus:border-yellow-500"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-gray-900 py-3 font-bold text-white hover:bg-yellow-500 hover:text-gray-900 disabled:opacity-60"
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
            <button
              type="button"
              onClick={() => {
                setResetEmail(loginForm.identifier);
                setAuthModalMode('forgotPassword');
              }}
              className="w-full text-sm font-semibold text-gray-600 hover:text-yellow-700"
            >
              Forgot password?
            </button>
            <button
              type="button"
              onClick={() => setAuthModalMode('register')}
              className="w-full text-sm font-semibold text-yellow-700 hover:text-yellow-800"
            >
              Create a new account
            </button>
          </form>
        )}

        {authModalMode === 'forgotPassword' && (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
            <p className="text-sm leading-6 text-gray-600">
              Enter your registered email. If it exists, we will send a password reset OTP.
            </p>
            <input
              type="email"
              value={resetEmail}
              onChange={(event) => setResetEmail(event.target.value)}
              placeholder="Registered email"
              className="w-full rounded-md border border-gray-300 px-3 py-3 outline-none focus:border-yellow-500"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-gray-900 py-3 font-bold text-white hover:bg-yellow-500 hover:text-gray-900 disabled:opacity-60"
            >
              {isSubmitting ? 'Sending OTP...' : 'Send reset OTP'}
            </button>
            <button
              type="button"
              onClick={() => setAuthModalMode('login')}
              className="w-full text-sm font-semibold text-yellow-700 hover:text-yellow-800"
            >
              Back to login
            </button>
          </form>
        )}

        {authModalMode === 'resetOtp' && (
          <form onSubmit={handleResetOtpSubmit} className="space-y-4">
            <p className="text-sm leading-6 text-gray-600">
              Enter the password reset OTP sent to {resetEmail || 'your email'}.
            </p>
            <input
              type="text"
              inputMode="numeric"
              value={resetOtp}
              onChange={(event) => setResetOtp(event.target.value)}
              placeholder="6 digit OTP"
              className="w-full rounded-md border border-gray-300 px-3 py-3 outline-none focus:border-yellow-500"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-gray-900 py-3 font-bold text-white hover:bg-yellow-500 hover:text-gray-900 disabled:opacity-60"
            >
              {isSubmitting ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
              type="button"
              onClick={() => setAuthModalMode('forgotPassword')}
              className="w-full text-sm font-semibold text-yellow-700 hover:text-yellow-800"
            >
              Change email
            </button>
          </form>
        )}

        {authModalMode === 'resetPassword' && (
          <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
            <input
              type="password"
              value={resetPasswordForm.password}
              onChange={(event) =>
                setResetPasswordForm({ ...resetPasswordForm, password: event.target.value })
              }
              placeholder="New password"
              className="w-full rounded-md border border-gray-300 px-3 py-3 outline-none focus:border-yellow-500"
              required
            />
            <input
              type="password"
              value={resetPasswordForm.confirmPassword}
              onChange={(event) =>
                setResetPasswordForm({
                  ...resetPasswordForm,
                  confirmPassword: event.target.value,
                })
              }
              placeholder="Confirm new password"
              className="w-full rounded-md border border-gray-300 px-3 py-3 outline-none focus:border-yellow-500"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-gray-900 py-3 font-bold text-white hover:bg-yellow-500 hover:text-gray-900 disabled:opacity-60"
            >
              {isSubmitting ? 'Resetting...' : 'Reset password'}
            </button>
          </form>
        )}

        {authModalMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                type="text"
                value={registerForm.firstName}
                onChange={(event) => setRegisterForm({ ...registerForm, firstName: event.target.value })}
                placeholder="First name"
                className="w-full rounded-md border border-gray-300 px-3 py-3 outline-none focus:border-yellow-500"
                required
              />
              <input
                type="text"
                value={registerForm.lastName}
                onChange={(event) => setRegisterForm({ ...registerForm, lastName: event.target.value })}
                placeholder="Last name"
                className="w-full rounded-md border border-gray-300 px-3 py-3 outline-none focus:border-yellow-500"
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                type="email"
                value={registerForm.email}
                onChange={(event) => setRegisterForm({ ...registerForm, email: event.target.value })}
                placeholder="Email for OTP"
                className="w-full rounded-md border border-gray-300 px-3 py-3 outline-none focus:border-yellow-500"
                required
              />
              <input
                type="tel"
                value={registerForm.phone}
                onChange={(event) => setRegisterForm({ ...registerForm, phone: event.target.value })}
                placeholder="Phone"
                className="w-full rounded-md border border-gray-300 px-3 py-3 outline-none focus:border-yellow-500"
              />
            </div>
            <input
              type="text"
              value={registerForm.address}
              onChange={(event) => setRegisterForm({ ...registerForm, address: event.target.value })}
              placeholder="Address optional"
              className="w-full rounded-md border border-gray-300 px-3 py-3 outline-none focus:border-yellow-500"
            />
            <div className="rounded-md border border-gray-200 p-3">
              <p className="text-sm font-bold text-gray-700">OTP will be sent to your email.</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                type="password"
                value={registerForm.password}
                onChange={(event) => setRegisterForm({ ...registerForm, password: event.target.value })}
                placeholder="Password"
                className="w-full rounded-md border border-gray-300 px-3 py-3 outline-none focus:border-yellow-500"
                required
              />
              <input
                type="password"
                value={registerForm.confirmPassword}
                onChange={(event) =>
                  setRegisterForm({ ...registerForm, confirmPassword: event.target.value })
                }
                placeholder="Confirm"
                className="w-full rounded-md border border-gray-300 px-3 py-3 outline-none focus:border-yellow-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-gray-900 py-3 font-bold text-white hover:bg-yellow-500 hover:text-gray-900 disabled:opacity-60"
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
            <button
              type="button"
              onClick={() => setAuthModalMode('login')}
              className="w-full text-sm font-semibold text-yellow-700 hover:text-yellow-800"
            >
              Already have an account? Login
            </button>
          </form>
        )}

        {authModalMode === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <p className="text-sm leading-6 text-gray-600">
              Enter the OTP sent to {otpState?.destination || 'your selected contact'}.
            </p>
            <input
              type="text"
              inputMode="numeric"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              placeholder="6 digit OTP"
              className="w-full rounded-md border border-gray-300 px-3 py-3 outline-none focus:border-yellow-500"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-gray-900 py-3 font-bold text-white hover:bg-yellow-500 hover:text-gray-900 disabled:opacity-60"
            >
              {isSubmitting ? 'Verifying...' : 'Verify and continue'}
            </button>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isSubmitting}
              className="w-full text-sm font-semibold text-yellow-700 hover:text-yellow-800 disabled:opacity-60"
            >
              Resend OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default AuthModal;
