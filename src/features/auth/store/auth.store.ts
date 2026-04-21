import { create } from "zustand";

import { storage } from "@/shared/storage";
import { authService } from "../services/auth.service";

/* ---------------------------------- */
/* Storage Keys */
/* ---------------------------------- */
const KEYS = {
  TOKEN: "auth_token",
  REFRESH: "auth_refresh_token",
  USER: "auth_user",
};

type AuthState = {
  token: string | null;
  refreshToken: string | null;
  user: any;
  status: "idle" | "loading" | "authenticated";

  loading: boolean;
  hydrated: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  setSession: (token: string, refreshToken: string, user: any) => void;
  forgotPassword: (email: string) => Promise<void>;
  uploadAvatar: (imageUri: string) => Promise<void>;
  updateUser: (payload: { username?: string; email?: string }) => Promise<void>;
  clearSession: () => void;
  hydrate: () => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  refreshToken: null,
  user: null,
  status: "idle",
  loading: false,
  hydrated: false,

  /* ---------- LOGIN ---------- */
  login: async (email, password) => {
    try {
      set({ status: "loading", loading: true });

      const data = await authService.login({ email, password });

      storage.set(KEYS.TOKEN, data.accessToken);
      storage.set(KEYS.REFRESH, data.refreshToken);
      storage.set(KEYS.USER, JSON.stringify(data.user));

      set({
        token: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
        status: "authenticated",
        loading: false,
      });
    } catch (error) {
      console.log("Error --> ", error);
      set({ status: "idle", loading: false });
      throw error;
    }
  },

  /* ---------- REGISTER ---------- */
  register: async ({ name, email, password }) => {
    try {
      set({ loading: true });

      await authService.register({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        username: name.toLowerCase().replace(/\s+/g, ""),
        role: "USER",
      });

      set({ loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  /* ---------- FORGET PASSWORD ---------- */
  forgotPassword: async (email: string) => {
    try {
      set({ loading: true });

      await authService.forgotPassword(email);

      set({ loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  /* ---------- UPLOAD AVATAR ---------- */
  uploadAvatar: async (imageUri: string) => {
    try {
      set({ loading: true });

      const updatedUser = await authService.updateAvatar(imageUri);

      console.log("User response -> ", updatedUser);

      storage.set(KEYS.USER, JSON.stringify(updatedUser));

      set({
        user: updatedUser,
        loading: false,
      });
    } catch (error) {
      console.log("Avatar Error --> ", error);
      set({ loading: false });
      throw error;
    }
  },

  /* ---------- UPDATE USER (LOCAL UPDATE) ---------- */
  updateUser: async (payload) => {
    try {
      set({ loading: true });

      const currentUser = get().user;

      const updatedUser = {
        ...currentUser,
        ...payload,
      };

      storage.set(KEYS.USER, JSON.stringify(updatedUser));

      set({
        user: updatedUser,
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  /* ---------- SET SESSION (used by interceptor refresh too) ---------- */
  setSession: (token, refreshToken, user) => {
    storage.set(KEYS.TOKEN, token);
    storage.set(KEYS.REFRESH, refreshToken);
    storage.set(KEYS.USER, JSON.stringify(user));

    set({
      token,
      refreshToken,
      user,
      status: "authenticated",
    });
  },

  /* ---------- CLEAR SESSION ---------- */
  clearSession: () => {
    storage.remove(KEYS.TOKEN);
    storage.remove(KEYS.REFRESH);
    storage.remove(KEYS.USER);

    set({
      token: null,
      refreshToken: null,
      user: null,
      status: "idle",
    });
  },

  /* ---------- HYDRATE (app start) ---------- */
  hydrate: () => {
    const token = storage.getString(KEYS.TOKEN);
    const refreshToken = storage.getString(KEYS.REFRESH);
    const userStr = storage.getString(KEYS.USER);

    if (token && refreshToken && userStr) {
      set({
        token,
        refreshToken,
        user: JSON.parse(userStr),
        status: "authenticated",
      });
    }
    set({ hydrated: true });
  },
}));
