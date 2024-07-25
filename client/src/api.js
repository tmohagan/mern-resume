import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

if (api.interceptors) {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });
}

export const searchApi = axios.create({
  baseURL: process.env.REACT_APP_GO_SEARCH_SERVICE_URL,
  withCredentials: false,
});

export const commentApi = axios.create({
  baseURL: process.env.REACT_APP_JAVA_COMMENT_SERVICE_URL,
  withCredentials: true,
});

export default api;