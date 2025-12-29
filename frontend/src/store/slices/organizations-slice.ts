import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Organization } from "@/types";

interface OrganizationsState {
  selectedOrganization: Organization | null;
}

const initialState: OrganizationsState = {
  selectedOrganization: null,
};

const organizationsSlice = createSlice({
  name: "organizations",
  initialState,
  reducers: {
    setSelectedOrganization: (
      state,
      action: PayloadAction<Organization | null>
    ) => {
      state.selectedOrganization = action.payload;
    },
    clearSelection: (state) => {
      state.selectedOrganization = null;
    },
  },
});

export const { setSelectedOrganization, clearSelection } =
  organizationsSlice.actions;

export default organizationsSlice.reducer;
