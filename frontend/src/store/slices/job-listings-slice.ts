import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { JobListing } from "@/types";

interface JobListingsState {
  selectedJobListing: JobListing | null;
}

const initialState: JobListingsState = {
  selectedJobListing: null,
};

const jobListingsSlice = createSlice({
  name: "jobListings",
  initialState,
  reducers: {
    setSelectedJobListing: (
      state,
      action: PayloadAction<JobListing | null>
    ) => {
      state.selectedJobListing = action.payload;
    },
    clearSelection: (state) => {
      state.selectedJobListing = null;
    },
  },
});

export const { setSelectedJobListing, clearSelection } =
  jobListingsSlice.actions;

export default jobListingsSlice.reducer;
