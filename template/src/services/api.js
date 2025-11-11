import axios from "axios";

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

// Export API URL for components that need it
export const API_BASE_URL = API_URL;

export const api = axios.create({
  baseURL: API_URL,
});

// Add authorization header if token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper function to build full API URL
export const getApiUrl = (endpoint) => {
  return `${API_URL}${endpoint}`;
};

