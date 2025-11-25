import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Organization } from "@/types/organization.type";

interface OrganizationsState {
  organizations: Organization[];
  selectedOrganization: Organization | null;
  isLoading: boolean;
  error: string | null;
  count: number;
}

const initialState: OrganizationsState = {
  organizations: [],
  selectedOrganization: null,
  isLoading: false,
  error: null,
  count: 0,
};

const organizationsSlice = createSlice({
  name: "organizations",
  initialState,
  reducers: {
    setOrganizations: (
      state,
      action: PayloadAction<{ organizations: Organization[]; count: number }>
    ) => {
      state.organizations = action.payload.organizations;
      state.count = action.payload.count;
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
      state.count += 1;
    },
    updateOrganization: (state, action: PayloadAction<Organization>) => {
      const index = state.organizations.findIndex(
        (org) => org.id === action.payload.id
      );
      if (index !== -1) {
        state.organizations[index] = action.payload;
      }
      if (state.selectedOrganization?.id === action.payload.id) {
        state.selectedOrganization = action.payload;
      }
    },
    removeOrganization: (state, action: PayloadAction<string>) => {
      state.organizations = state.organizations.filter(
        (org) => org.id !== action.payload
      );
      state.count -= 1;
      if (state.selectedOrganization?.id === action.payload) {
        state.selectedOrganization = null;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearOrganizations: (state) => {
      state.organizations = [];
      state.selectedOrganization = null;
      state.count = 0;
      state.error = null;
    },
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
