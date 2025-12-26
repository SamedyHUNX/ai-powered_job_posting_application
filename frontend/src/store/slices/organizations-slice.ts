import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Organization, OrganizationsResponse } from "@/types";

interface OrganizationsState {
  organizations: Organization[];
  selectedOrganization: Organization | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrganizationsState = {
  organizations: [],
  selectedOrganization: null,
  isLoading: false,
  error: null,
};

const organizationsSlice = createSlice({
  name: "organizations",
  initialState,
  reducers: {
    setOrganizations: (state, action: PayloadAction<Organization[]>) => {
      state.organizations = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setSelectedOrganization: (
      state,
      action: PayloadAction<Organization | null>
    ) => {
      state.selectedOrganization = action.payload;
    },
    addOrganization: (state, action: PayloadAction<Organization>) => {
      state.organizations.push(action.payload);
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
  clearOrganizations,
} = organizationsSlice.actions;

export default organizationsSlice.reducer;
