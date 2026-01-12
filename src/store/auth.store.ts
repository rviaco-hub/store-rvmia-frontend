import { create } from "zustand";
import { setToken, clearToken } from "../utils/token";

interface AuthState {
  user: any;
  login: (data: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  login: data => {
    setToken(data.token);
    set({ user: data.user });
  },
  logout: () => {
    clearToken();
    set({ user: null });
  }
}));
