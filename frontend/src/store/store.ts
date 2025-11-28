import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth-slice";
import organizationsReducer from "./slices/organizations-slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    organizations: organizationsReducer,
  },
});

export const selectOrganizationMessage = (state: RootState) =>
  state.organizations.message;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
