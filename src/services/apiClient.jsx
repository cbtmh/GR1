// File: apiClient.jsx
import axios from 'axios';

const BASE_URL = "http://localhost:5000";

// Xóa bỏ hoàn toàn khối headers mặc định
const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
});

// Sử dụng interceptor để thêm token vào mỗi request
apiClient.interceptors.request.use((config) => {
  let user;
  if (window.location.pathname.startsWith('/admin')) {
    user = JSON.parse(localStorage.getItem('adminUser'));
  } else {
    user = JSON.parse(localStorage.getItem('user'));
  }
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export { BASE_URL };
export default apiClient;