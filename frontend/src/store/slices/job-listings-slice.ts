import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { JobListing } from "@/types";

interface JobListingsState {
  jobListings: JobListing[];
  selectedJobListing: JobListing | null;
  isLoading: boolean;
  status: "idle" | "loading" | "success" | "error";
  message: string | null;
  count: number;
  code: string | null;
}

const initialState: JobListingsState = {
  jobListings: [],
  selectedJobListing: null,
  isLoading: false,
  status: "idle",
  message: null,
  count: 0,
  code: "",
};

const jobListingsSlice = createSlice({
  name: "jobListings",
  initialState,
  reducers: {
    setJobListings: (
      state,
      action: PayloadAction<{ jobListings: JobListing[]; count: number }>
    ) => {
      state.jobListings = action.payload.jobListings;
      state.count = action.payload.count;
      state.isLoading = false;
      state.status = "success";
      state.message = "Job listings loaded successfully";
    },
    setSelectedJobListing: (
      state,
      action: PayloadAction<JobListing | null>
    ) => {
      state.selectedJobListing = action.payload;
    },
    addJobListing: (state, action: PayloadAction<JobListing>) => {
      state.jobListings.push(action.payload);
      state.count += 1;
      state.status = "success";
      state.message = "Job listing added successfully";
    },
    updateJobListing: (state, action: PayloadAction<JobListing>) => {
      const index = state.jobListings.findIndex(
        (listing) => listing.id === action.payload.id
      );
      if (index !== -1) {
        state.jobListings[index] = action.payload;
      }
      if (state.selectedJobListing?.id === action.payload.id) {
        state.selectedJobListing = action.payload;
      }
      state.status = "success";
      state.message = "Job listing updated successfully";
    },
    removeJobListing: (state, action: PayloadAction<string>) => {
      state.jobListings = state.jobListings.filter(
        (listing) => listing.id !== action.payload
      );
      state.count -= 1;
      if (state.selectedJobListing?.id === action.payload) {
        state.selectedJobListing = null;
      }
      state.status = "success";
      state.message = "Job listing removed successfully";
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
    clearJobListings: (state) => {
      state.jobListings = [];
      state.selectedJobListing = null;
      state.count = 0;
      state.status = "idle";
      state.message = null;
    },
  },
});

export const {
  setJobListings,
  setSelectedJobListing,
  addJobListing,
  updateJobListing,
  removeJobListing,
  setSuccess,
  setLoading,
  setError,
  clearJobListings,
} = jobListingsSlice.actions;

export default jobListingsSlice.reducer;
