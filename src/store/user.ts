import { create } from "zustand";
import api from "../axios";
import type { LoginFormInputType } from "../pages/LoginRegister";

export interface User {
  _id: string;
  name: string;
  email: string;
  premiumExpire: string; // ISO date string
  password: string;
  role: "user" | "admin"; // if you expect only these roles
  isVerified: boolean;
  bookmarksMovies: string[]; // or maybe Movie[] if you have a Movie type
  favoritesMovies: string[];
  bookmarksTV: string[];
  favoritesTV: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isChecking: boolean;
  login: (payload: LoginFormInputType) => Promise<void>;
  logout: () => Promise<void>;
  setToken: (token: string | null) => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isChecking: false,

  setToken: (token) => set({ accessToken: token }),

  login: async ({ email, password }) => {
    const { data } = await api.post("auth/login", { email, password });
    set({ user: data.user, accessToken: data.accessToken });
  },

  logout: async () => {
    await api.post("/auth/logout");
    set({ user: null, accessToken: null });
  },

  fetchMe: async () => {
      set({ isChecking: true });
    try {

      const { data } = await api.get("/auth/info");
      set({ user: data.user });
    } catch {
      set({ user: null, accessToken: null });
        setTimeout(() => {
            set({ isChecking: false });
        },1000)
    } finally {
        setTimeout(() => {
            set({ isChecking: false });
        },100)
      
    }
  },
}));
