import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSignup: false,
  isLogingIn: false,
  isUpdateProfile: false,
  isCheckingAuth: true,
  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check");
      set({ authUser: response.data });
    } catch (error) {
      console.error("Error checking authentication:", error);
      set({ authUser: Null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));
