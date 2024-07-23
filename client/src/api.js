import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

export const searchApi = axios.create({
  baseURL: process.env.REACT_APP_GO_SEARCH_SERVICE_URL,
  withCredentials: false,
});

export default api;