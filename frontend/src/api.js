import tokens from "./constants";
import axios from "axios";

// Base URL and headers as constants for better readability
const BASE_URL = import.meta.env.VITE_API_URL;
const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: DEFAULT_HEADERS,
});

// Request interceptor for adding authorization token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(tokens.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error); // Improved error logging
    return Promise.reject(error);
  }
);

// Optionally, you could add a response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Response error:", error); // Log response errors for debugging
    return Promise.reject(error);
  }
);

export default api;
