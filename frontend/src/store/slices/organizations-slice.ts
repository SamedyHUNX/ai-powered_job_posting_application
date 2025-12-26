import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Organization } from "@/types";

interface OrganizationsState {
  organizations: Organization[];
  selectedOrganization: Organization | null;
  isLoading: boolean;
  error: string | null;
  status: string | null;
  code: number | null;
  message: string | null;
}

const initialState: OrganizationsState = {
  organizations: [],
  selectedOrganization: null,
  isLoading: false,
  error: null,
  status: null,
  code: null,
  message: null,
};

const organizationsSlice = createSlice({
  name: "organizations",
  initialState,
  reducers: {
    setOrganizations: (
      state,
      action: PayloadAction<{
        organizations: Organization[];
        status: string;
        code: number;
        message: string;
      }>
    ) => {
      state.organizations = action.payload.organizations;
      state.status = action.payload.status || null;
      state.code = action.payload.code || null;
      state.message = action.payload.message || null;
      state.isLoading = false;
      state.error = null;
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
        status?: string;
        code?: number;
        message?: string;
      }>
    ) => {
      state.organizations.push(action.payload.organization);
      state.status = action.payload.status || null;
      state.code = action.payload.code || null;
      state.message = action.payload.message || null;
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
      state.status = null;
      state.code = null;
      state.message = null;
    },
    clearResponse: (state) => {
      state.status = null;
      state.code = null;
      state.message = null;
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
  clearResponse,
  clearOrganizations,
} = organizationsSlice.actions;

export default organizationsSlice.reducer;
