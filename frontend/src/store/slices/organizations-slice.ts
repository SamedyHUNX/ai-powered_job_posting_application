import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Organization } from "@/types";

interface OrganizationsState {
  organizations: Organization[];
  selectedOrganization: Organization | null;
  isLoading: boolean;
  error: string | null;
  lastResponse: {
    status: string;
    code: number;
    message: string;
  } | null;
}

const initialState: OrganizationsState = {
  organizations: [],
  selectedOrganization: null,
  isLoading: false,
  error: null,
  lastResponse: null,
};

const organizationsSlice = createSlice({
  name: "organizations",
  initialState,
  reducers: {
    setOrganizations: (
      state,
      action: PayloadAction<{
        organizations: Organization[];
        response?: { status: string; code: number; message: string };
      }>
    ) => {
      state.organizations = action.payload.organizations;
      state.isLoading = false;
      state.error = null;
      if (action.payload.response) {
        state.lastResponse = action.payload.response;
      }
    },
    setSelectedOrganization: (
      state,
      action: PayloadAction<Organization | null>
    ) => {
      state.selectedOrganization = action.payload;
    },
    addOrganization: (
      state,
      action: PayloadAction<{
        organization: Organization;
        response?: { status: string; code: number; message: string };
      }>
    ) => {
      state.organizations.push(action.payload.organization);
      if (action.payload.response) {
        state.lastResponse = action.payload.response;
      }
    },
    updateOrganization: (state, action: PayloadAction<Organization>) => {
      const index = state.organizations.findIndex(
        (org) => org.id === action.payload.id
      );
      if (index !== -1) {
        state.organizations[index] = action.payload;
        if (state.selectedOrganization?.id === action.payload.id) {
          state.selectedOrganization = action.payload;
        }
      }
    },
    removeOrganization: (state, action: PayloadAction<string>) => {
      state.organizations = state.organizations.filter(
        (org) => org.id !== action.payload
      );
      if (state.selectedOrganization?.id === action.payload) {
        state.selectedOrganization = null;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.lastResponse = null;
    },
    clearLastResponse: (state) => {
      state.lastResponse = null;
    },
    clearOrganizations: () => initialState,
  },
});

export const {
  setOrganizations,
  setSelectedOrganization,
  addOrganization,
  updateOrganization,
  removeOrganization,
  setLoading,
  setError,
  clearLastResponse,
  clearOrganizations,
} = organizationsSlice.actions;

export default organizationsSlice.reducer;
