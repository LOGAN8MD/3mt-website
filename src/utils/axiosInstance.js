import axios from 'axios';
import {
  SLOW_REQUEST_DELAY_MS,
  markApiRequestDelayed,
} from './apiDelayNotifier';
import { getStoredAuthToken } from './authStorage';

const apiBaseURL = process.env.REACT_APP_API_BASE_URL?.trim().replace(/\/+$/, '');

if (!apiBaseURL) {
  throw new Error('REACT_APP_API_BASE_URL is not configured');
}

const axiosInstance = axios.create({
  baseURL: apiBaseURL,
});

const clearApiDelayTimer = (config) => {
  const delayState = config?.apiDelayState;

  if (!delayState) {
    return;
  }

  clearTimeout(delayState.timerId);

  if (delayState.hidePopup) {
    delayState.hidePopup();
  }

  delete config.apiDelayState;
};

axiosInstance.interceptors.request.use((config) => {
  const delayState = {
    hidePopup: null,
    timerId: null,
  };

  delayState.timerId = setTimeout(() => {
    delayState.hidePopup = markApiRequestDelayed();
  }, SLOW_REQUEST_DELAY_MS);

  config.apiDelayState = delayState;

  const token = getStoredAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    clearApiDelayTimer(response.config);
    return response;
  },
  (error) => {
    clearApiDelayTimer(error.config);

    if (error.response && error.response.data && error.response.data.message) {
      error.message = error.response.data.message;
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
