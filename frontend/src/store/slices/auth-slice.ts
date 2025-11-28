import { AuthResponse } from "@/types/response.auth.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { set } from "zod";

export interface User {
  id: string;
  email: string;
  username: string;
  imageUrl: string;
  userRole: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  message: string | null;
  code: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isInitialized: false,
  message: "",
  code: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    initializeAuth: (
      state,
      action: PayloadAction<{ token: string; user?: User }>
    ) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isInitialized = true;
      if (action.payload.user) {
        state.user = action.payload.user;
      }
    },
    markInitialized: (state) => {
      state.isInitialized = true;
    },
    setSuccess: (state, action: PayloadAction<{ message: string }>) => {
      state.message = action.payload.message;
    },
    setError: (
      state,
      action: PayloadAction<{ message: string; code: string }>
    ) => {
      state.message = action.payload.message;
      state.code = action.payload.code;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
    },
  },
});

export const {
  setCredentials,
  setUser,
  initializeAuth,
  markInitialized,
  logout,
} = authSlice.actions;
export default authSlice.reducer;
