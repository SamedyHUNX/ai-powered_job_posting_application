import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Organization } from "@/types";

interface OrganizationsState {
  organizations: Organization[];
  selectedOrganization: Organization | null;
  isLoading: boolean;
  status: "idle" | "loading" | "success" | "error";
  message: string | null;
  count: number;
  code: string | null;
}

const initialState: OrganizationsState = {
  organizations: [],
  selectedOrganization: null,
  isLoading: false,
  status: "idle",
  message: null,
  count: 0,
  code: "",
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
      state.status = "success";
      state.message = "Organizations loaded successfully";
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
      state.status = "success";
      state.message = "Organization added successfully";
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
      state.status = "success";
      state.message = "Organization updated successfully";
    },
    removeOrganization: (state, action: PayloadAction<string>) => {
      state.organizations = state.organizations.filter(
        (org) => org.id !== action.payload
      );
      state.count -= 1;
      if (state.selectedOrganization?.id === action.payload) {
        state.selectedOrganization = null;
      }
      state.status = "success";
      state.message = "Organization removed successfully";
    },
    setSuccess: (state, action: PayloadAction<string | null>) => {
      state.isLoading = false;
      state.status = "success";
      state.message = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      state.status = action.payload ? "loading" : "idle";
      if (action.payload) state.message = null;
    },
    setError: (
      state,
      action: PayloadAction<{ message: string; code: string }>
    ) => {
      state.isLoading = false;
      state.status = "error";
      state.message = action.payload.message;
      state.code = action.payload.code;
    },
    clearOrganizations: (state) => {
      state.organizations = [];
      state.selectedOrganization = null;
      state.count = 0;
      state.status = "idle";
      state.message = null;
    },
  },
});

export const {
  setOrganizations,
  setSelectedOrganization,
  addOrganization,
  updateOrganization,
  removeOrganization,
  setSuccess,
  setLoading,
  setError,
  clearOrganizations,
} = organizationsSlice.actions;

export default organizationsSlice.reducer;
