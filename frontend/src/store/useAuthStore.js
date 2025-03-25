import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  // Check Authentication
  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/api/auth/check");

      set({ authUser: response.data });
    } catch (error) {
      console.log("Error in checkAuth store", error.message);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Signup routing
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/api/auth/register", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
    } catch (error) {
      toast.error(error.response.data.error);
    } finally {
      set({ isSigningUp: false });
    }
  },

  // Logout Routing
  logout: async () => {
    try {
      await axiosInstance.post("/api/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response.data.error);
    }
  },

  // Login Routing
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("api/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error.response.data.error);
    } finally {
      set({ isLoggingIn: false });
    }
  },
}));
