import axios from "axios";

// Get API URL from environment variables and ensure no trailing slash
const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5001").replace(/\/$/, "");

// Export API URL for components that need it
export const API_BASE_URL = API_URL;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Enable sending cookies with requests
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
  // Ensure endpoint starts with /
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_URL}${cleanEndpoint}`;
};

