import axiosInstance from '../utils/axiosInstance';

const AUTH_ENDPOINT = '/api/auth';
const USERS_ENDPOINT = '/api/users';

export const loginCustomer = (payload) =>
  axiosInstance.post(`${AUTH_ENDPOINT}/login`, payload).then((response) => response.data);

export const registerCustomer = (payload) =>
  axiosInstance.post(`${AUTH_ENDPOINT}/register`, payload).then((response) => response.data);

export const verifyRegistrationOtp = (payload) =>
  axiosInstance.post(`${AUTH_ENDPOINT}/verify-otp`, payload).then((response) => response.data);

export const resendRegistrationOtp = (payload) =>
  axiosInstance.post(`${AUTH_ENDPOINT}/resend-otp`, payload).then((response) => response.data);

export const requestPasswordReset = (payload) =>
  axiosInstance.post(`${AUTH_ENDPOINT}/forgot-password`, payload).then((response) => response.data);

export const verifyPasswordResetOtp = (payload) =>
  axiosInstance.post(`${AUTH_ENDPOINT}/verify-reset-otp`, payload).then((response) => response.data);

export const resetPassword = (payload) =>
  axiosInstance.post(`${AUTH_ENDPOINT}/reset-password`, payload).then((response) => response.data);

export const googleLoginCustomer = (payload) =>
  axiosInstance.post(`${AUTH_ENDPOINT}/google`, payload).then((response) => response.data);

export const getMyProfile = () =>
  axiosInstance.get(`${USERS_ENDPOINT}/me`).then((response) => response.data);

export const updateMyProfile = (payload) =>
  axiosInstance.put(`${USERS_ENDPOINT}/me`, payload).then((response) => response.data);
