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

  login: (credentials: LoginCredentials) => Promise<boolean>;
  registerCustomer: (data: RegisterCustomerData) => Promise<void>;
  registerShop: (data: RegisterShopData) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  initializeAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials): Promise<boolean> => {
    try {
      set({ isLoading: true, error: null });

      const response = await authApi.login(credentials);
      console.log("Login API response:", response);
      console.log("response.success:", response.success);
      console.log("response.data:", response.data);

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
        console.log("Login successful, returning true");
        return true;
      }
      console.log("Login failed: response.success or response.data is falsy");
      return false; // Failed
    } catch (error: any) {
      console.error("Login error caught:", error);
      console.error("Error response:", error.response);
      console.error("Error response data:", error.response?.data);

      let errorMessage =
        error.response?.data?.error || error.message || "Login failed";

      console.log("Backend error message:", errorMessage);

      if (errorMessage.toLowerCase().includes("pending")) {
        errorMessage =
          "Shop verification pending. Your account is awaiting admin approval.";
      } else if (errorMessage.toLowerCase().includes("reject")) {
        errorMessage = "Shop registration rejected. Please contact support.";
      } else if (
        errorMessage.toLowerCase().includes("invalid") ||
        errorMessage.toLowerCase().includes("credentials")
      ) {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (!error.response) {
        errorMessage = "Unable to connect to server. Please try again later.";
      }

      console.log("Final error message to display:", errorMessage);

      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false,
      });
      return false;
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
