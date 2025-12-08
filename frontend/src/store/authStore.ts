import { create } from "zustand";
import * as authApi from "../lib/api/auth";
import type {
  User,
  LoginCredentials,
  RegisterCustomerData,
  RegisterShopData,
} from "../lib/api/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  registerCustomer: (data: RegisterCustomerData) => Promise<void>;
  registerShop: (data: RegisterShopData) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  initializeAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    try {
      set({ isLoading: true, error: null });

      const response = await authApi.login(credentials);

      if (response.success && response.data) {
        const { token, refreshToken, user } = response.data;

        localStorage.setItem("access_token", token);
        if (refreshToken) {
          localStorage.setItem("refresh_token", refreshToken);
        }

        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Login failed";
      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  registerCustomer: async (data) => {
    try {
      set({ isLoading: true, error: null });

      const response = await authApi.registerCustomer(data);

      if (response.success && response.data) {
        const { token, refreshToken, user } = response.data;

        localStorage.setItem("access_token", token);
        if (refreshToken) {
          localStorage.setItem("refresh_token", refreshToken);
        }

        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Registration failed";
      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  registerShop: async (data) => {
    try {
      set({ isLoading: true, error: null });

      const response = await authApi.registerShop(data);

      if (response.success && response.data) {
        const { token, refreshToken, user } = response.data;

        localStorage.setItem("access_token", token);
        if (refreshToken) {
          localStorage.setItem("refresh_token", refreshToken);
        }

        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Registration failed";
      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      });
    }
  },

  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },

  setToken: (token) => {
    if (token) {
      localStorage.setItem("access_token", token);
    } else {
      localStorage.removeItem("access_token");
    }
    set({ token });
  },

  initializeAuth: async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      set({ isLoading: false, isAuthenticated: false });
      return;
    }

    try {
      set({ isLoading: true });

      const response = await authApi.getCurrentUser();

      if (response.success && response.data.user) {
        set({
          user: response.data.user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        localStorage.removeItem("access_token");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Auth initialization failed:", error);
      localStorage.removeItem("access_token");
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
