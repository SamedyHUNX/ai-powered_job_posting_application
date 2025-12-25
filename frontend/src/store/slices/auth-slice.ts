import { User } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface AuthState {
  user: User | null;
  token: string | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isInitialized = true;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isInitialized = true;
    },
    markInitialized: (state) => {
      state.isInitialized = true;
    },
  },
});

export const { setAuth, clearAuth, markInitialized } = authSlice.actions;

export const selectIsAuthenticated = (state: RootState) => !!state.auth.token;

export default authSlice.reducer;
