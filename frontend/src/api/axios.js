import axios from "axios";

// All backend routes are prefixed with /api - this base URL matches server.js
export const SERVER_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: `${SERVER_URL}/api`,
});

// Automatically attach the saved JWT token (if any) to every request.
// This runs before each request goes out.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
