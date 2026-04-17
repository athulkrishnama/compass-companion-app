import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginResponse } from "@/types/auth";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

const AUTH_TOKEN_KEY = "auth_token";
const USER_DATA_KEY = "user_data";

interface AuthContextType {
  token: string | null;
  user: LoginResponse["userData"] | null;
  isLoading: boolean;
  login: (data: LoginResponse) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<LoginResponse["userData"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem(AUTH_TOKEN_KEY),
          AsyncStorage.getItem(USER_DATA_KEY),
        ]);
        if (storedToken) setToken(storedToken);
        if (storedUser) setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to load auth data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAuth();
  }, []);

  const login = useCallback(async (data: LoginResponse) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(AUTH_TOKEN_KEY, data.accessToken),
        AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(data.userData)),
      ]);
      setToken(data.accessToken);
      setUser(data.userData);
    } catch (error) {
      console.error("Failed to save auth data:", error);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(AUTH_TOKEN_KEY),
        AsyncStorage.removeItem(USER_DATA_KEY),
      ]);
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error("Failed to clear auth data:", error);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const { default: axiosInstance } = await import("@/axios/axiosInstance");
      const response = await axiosInstance.post('/auth/refresh-token', {}, { withCredentials: true });
      const newToken = response.data.data.accessToken;
      
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, newToken);
      setToken(newToken);
      return newToken;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      logout();
      throw error;
    }
  }, [logout]);

  return (
    <AuthContext.Provider value={{ token, user, isLoading, login, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
