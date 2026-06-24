import axios from 'axios';

const apiBaseURL = process.env.REACT_APP_API_BASE_URL?.trim().replace(/\/+$/, '');

if (!apiBaseURL) {
  throw new Error('REACT_APP_API_BASE_URL is not configured');
}

const axiosInstance = axios.create({
  baseURL: apiBaseURL,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.data && error.response.data.message) {
      error.message = error.response.data.message;
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
