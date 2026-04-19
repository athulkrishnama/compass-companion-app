import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";

const AUTH_TOKEN_KEY = "auth_token";
const USER_DATA_KEY = "user_data";

const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // needed for httpOnly refresh-token cookie
});

// ── Request interceptor ─────────────────────────────────────────────────────
// Attach the access token from AsyncStorage on every request
axiosInstance.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor ────────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // 403 blocked — clear auth and redirect to login
    if (
      err.response?.status === 403 &&
      err.response?.data?.error === "blocked"
    ) {
      await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_DATA_KEY]);
      router.replace("/login");
      return Promise.reject(err);
    }

    // 401 invalidToken — attempt a silent token refresh (once)
    if (
      err.response?.status === 401 &&
      err.response?.data?.error === "invalidToken" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axiosInstance.post(
          "/auth/refresh-token",
          {},
          { withCredentials: true }
        );
        const newToken: string = refreshResponse.data.data.accessToken;

        // Persist the fresh token
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, newToken);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh also failed — clear auth and send user to login
        await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_DATA_KEY]);
        router.replace("/login");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  }
);

export default axiosInstance;