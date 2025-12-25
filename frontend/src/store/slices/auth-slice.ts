import { User } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: User | null;
  token: string | null;
  status: "idle" | "loading" | "success" | "error";
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  message: string | null;
  code: number | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  status: "idle",
  isInitialized: false,
  isLoading: false,
  message: "",
  code: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCredentials: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLoading = false;
    },
    initializeAuth: (
      state,
      action: PayloadAction<{ token: string; user?: User }>
    ) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isInitialized = true;
      state.isLoading = true;
      if (action.payload.user) {
        state.user = action.payload.user;
        state.isLoading = false;
      }
    },
    markInitialized: (state) => {
      state.isInitialized = true;
      state.isLoading = false;
    },
    setSuccess: (state, action: PayloadAction<{ message: string }>) => {
      state.message = action.payload.message;
      state.isLoading = false;
    },
    setError: (
      state,
      action: PayloadAction<{ message: string; code: string }>
    ) => {
      state.message = action.payload.message;
      state.code = action.payload.code;
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
      state.isLoading = false;
    },
  },
});

export const {
  setLoading,
  setCredentials,
  setUser,
  initializeAuth,
  markInitialized,
  logout,
} = authSlice.actions;
export default authSlice.reducer;
