import AsyncStorage from "@react-native-async-storage/async-storage";
import CookieManager from "@preeternal/react-native-cookie-manager";
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

  // Get cookies for the url and append them
  try {
    const rawUrl = config.baseURL || process.env.EXPO_PUBLIC_BACKEND_URL;
    if (rawUrl) {
      // Extract the origin (e.g., http://localhost:4000)
      const url = rawUrl.match(/^(https?:\/\/[^\/]+)/)?.[1] || rawUrl;
      const cookies = await CookieManager.get(url);
      console.log(`[Request Interceptor] Fetching cookies for ${url}:`, JSON.stringify(cookies));
      
      if (cookies) {
        // Log specifically if refreshToken is present
        if (cookies.refreshToken) {
          console.log("[Request Interceptor] refreshToken cookie found:", cookies.refreshToken.value);
        } else {
          console.log("[Request Interceptor] refreshToken cookie NOT found in current cookies.");
        }

        const cookieString = Object.values(cookies)
          .map((c) => `${c.name}=${c.value}`)
          .join("; ");
        if (cookieString) {
          config.headers.Cookie = cookieString;
        }
      }
    }
  } catch (error) {
    console.error("[Request Interceptor] Error getting cookies from CookieManager:", error);
  }

  return config;
});

// ── Response interceptor ────────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  async (res) => {
    // Check and save Set-Cookie header if present
    const setCookie = res.headers["set-cookie"];
    if (setCookie) {
      console.log(`[Response Interceptor] Found Set-Cookie header on successful response from ${res.config.url}:`, setCookie);
      const rawUrl = res.config.baseURL || process.env.EXPO_PUBLIC_BACKEND_URL;
      if (rawUrl) {
        // Extract the origin (e.g., http://localhost:4000)
        const url = rawUrl.match(/^(https?:\/\/[^\/]+)/)?.[1] || rawUrl;
        try {
          const processCookie = async (cookieStr: string) => {
            let cleanCookie = cookieStr;
            // Android rejects Secure cookies over HTTP, so strip it for local development
            if (url.startsWith("http://")) {
              cleanCookie = cleanCookie
                .replace(/(;\s*)?Secure/gi, "")
                .replace(/(;\s*)?SameSite=None/gi, "");
            }
            await CookieManager.setFromResponse(url, cleanCookie);
          };

          if (Array.isArray(setCookie)) {
            for (const cookie of setCookie) {
              await processCookie(cookie);
            }
          } else {
            await processCookie(setCookie);
          }
          console.log("[Response Interceptor] Cookies saved successfully.");
          
          // Verify if cookie is now in CookieManager
          const updatedCookies = await CookieManager.get(url);
          if (updatedCookies.refreshToken) {
            console.log("[Response Interceptor] Verify: refreshToken cookie is present:", updatedCookies.refreshToken.value);
          } else {
            console.log("[Response Interceptor] Verify: refreshToken cookie is NOT present after saving.");
          }
        } catch (error) {
          console.error("[Response Interceptor] Error saving cookies from response:", error);
        }
      }
    }
    return res;
  },
  async (err) => {
    const originalRequest = err.config;

    // 403 blocked — clear auth and redirect to login
    if (
      err.response?.status === 403 &&
      err.response?.data?.error === "blocked"
    ) {
      console.log("[Response Interceptor] 403 Blocked status. Clearing auth and cookies.");
      await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_DATA_KEY]);
      try {
        await CookieManager.clearAll();
        console.log("[Response Interceptor] Cookies cleared successfully.");
      } catch (cookieErr) {
        console.error("[Response Interceptor] Failed to clear cookies:", cookieErr);
      }
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
        console.log("[Response Interceptor] 401 Invalid Token. Attempting silent token refresh.");
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
        
        // Re-inject cookies for the retry request just in case
        try {
          const rawUrl = originalRequest.baseURL || process.env.EXPO_PUBLIC_BACKEND_URL;
          if (rawUrl) {
            const url = rawUrl.match(/^(https?:\/\/[^\/]+)/)?.[1] || rawUrl;
            const cookies = await CookieManager.get(url);
            if (cookies) {
              const cookieString = Object.values(cookies)
                .map((c) => `${c.name}=${c.value}`)
                .join("; ");
              if (cookieString) {
                originalRequest.headers.Cookie = cookieString;
              }
            }
          }
        } catch (cookieErr) {
          console.error("[Response Interceptor] Failed to re-inject cookies for retry request:", cookieErr);
        }

        console.log("[Response Interceptor] Token refresh successful. Retrying original request.");
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh also failed — clear auth and send user to login
        console.log("[Response Interceptor] Token refresh failed. Clearing auth and cookies.");
        await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_DATA_KEY]);
        try {
          await CookieManager.clearAll();
          console.log("[Response Interceptor] Cookies cleared successfully.");
        } catch (cookieErr) {
          console.error("[Response Interceptor] Failed to clear cookies:", cookieErr);
        }
        router.replace("/login");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  }
);

export default axiosInstance;