import axios from "axios";

const baseURL = "https://daily-tracker-cf8u.onrender.com/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add Authorization header when token exists
api.interceptors.request.use(
  (config) => {
    try {
      const stored = localStorage.getItem("auth");
      if (stored) {
        const { token } = JSON.parse(stored);
        if (token) config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // ignore parse errors
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Placeholder for refresh token handling (future use)
export async function refreshToken() {
  // Implement refresh flow when backend supports it.
  return null;
}

export default api;
