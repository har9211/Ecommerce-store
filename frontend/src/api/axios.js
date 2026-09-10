import axios from "axios";

// All backend routes are prefixed with /api - this base URL matches server.js
export const SERVER_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: `${SERVER_URL}/api`,
});

// Automatically attach the active tab's JWT token (if any) to every request.
// Authentication is intentionally kept in sessionStorage so separate tabs/users
// do not accidentally share a token.
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
