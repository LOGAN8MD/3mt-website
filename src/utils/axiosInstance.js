import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'http://localhost:8080',  // Update with your backend URL
  baseURL: 'https://threemt-server.onrender.com', 
});

export default axiosInstance;
