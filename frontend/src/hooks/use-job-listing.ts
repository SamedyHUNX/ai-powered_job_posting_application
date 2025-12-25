import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setJobListings,
  setSelectedJobListing,
  addJobListing,
  updateJobListing,
  removeJobListing,
  setLoading,
  setError,
  clearJobListings,
  setSuccess,
} from "@/store/slices/job-listings-slice";
import { jobListingsApi } from "@/lib/job-listings-api";
import {
  JobListing,
  JobListingResponse,
} from "@/types";

export function useJobListing() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const token = useAppSelector((state) => state.auth.token);
  const { jobListings, selectedJobListing, isLoading, count } = useAppSelector(
    (state) => state.jobListings
  );

  // Fetch all job listings with filters
  const fetchJobListings = useCallback(
    async (
      search?: string,
      organizationId?: string,
      status?: string,
      type?: string,
      locationRequirement?: string,
      experienceLevel?: string
    ) => {
      try {
        dispatch(setLoading(true));
        const response = await jobListingsApi.findAll(
          search,
          organizationId,
          status,
          type,
          locationRequirement,
          experienceLevel
        );
        dispatch(
          setJobListings({
            jobListings: response.jobListings,
            count: response.count,
          })
        );
      } catch (err: any) {
        dispatch(
          setError({
            message: err.message || "Failed to fetch job listings",
            code: err.code || "FETCH_ERROR",
          })
        );
      }
    },
    [dispatch]
  );

  // Fetch job listings by organization
  const fetchJobListingsByOrganization = useCallback(
    async (organizationId: string) => {
      try {
        dispatch(setLoading(true));
        const response = await jobListingsApi.findByOrganization(
          organizationId
        );
        dispatch(
          setJobListings({
            jobListings: response.jobListings,
            count: response.count,
          })
        );
      } catch (err: any) {
        dispatch(
          setError({
            message: err.message || "Failed to fetch organization job listings",
            code: err.code || "FETCH_ERROR",
          })
        );
      }
    },
    [dispatch]
  );

  // Fetch single job listing
  //   const fetchJobListingQuery = (id: string) =>
  //     useQuery({
  //       queryKey: ["jobListing", id],
  //       queryFn: () => jobListingsApi.findOne(id),
  //       enabled: !!id,
  //     });

  // Fetch job listing by ID
  const fetchJobListingById = useCallback(
    async (id: string): Promise<JobListing | null> => {
      try {
        dispatch(setLoading(true));
        const response = await jobListingsApi.findOne(id);
        return response.jobListing;
      } catch (err: any) {
        dispatch(
          setError({
            message: err.message || "Failed to fetch job listing",
            code: err.code || "FETCH_ERROR",
          })
        );
        return null;
      }
    },
    [dispatch]
  );

  // Create job listing mutation
  const createJobListingMutation = useMutation({
    mutationFn: (
      dto: CreateJobListingDto
    ): Promise<JobListingResponse> => {
      if (!token) throw new Error("Authentication required");
      return jobListingsApi.create(dto, token);
    },
    onSuccess: (data) => {
      dispatch(addJobListing(data.jobListing));
      dispatch(setSuccess(data.message));
      queryClient.invalidateQueries({ queryKey: ["jobListings"] });
    },
    onError: (err: any) => {
      dispatch(
        setError({
          message: err.message || "Failed to create job listing",
          code: err.code || "CREATE_ERROR",
        })
      );
    },
  });

  // Update job listing mutation
  const updateJobListingMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateJobListingDto }) => {
      if (!token) throw new Error("Authentication required");
      return jobListingsApi.update(id, dto, token);
    },
    onSuccess: (data) => {
      dispatch(updateJobListing(data.jobListing));
      queryClient.invalidateQueries({ queryKey: ["jobListings"] });
      queryClient.invalidateQueries({
        queryKey: ["jobListing", data.jobListing.id],
      });
    },
    onError: (err: any) => {
      dispatch(
        setError({
          message: err.message || "Failed to update job listing",
          code: err.code || "UPDATE_ERROR",
        })
      );
    },
  });

  // Delete job listing mutation
  const deleteJobListingMutation = useMutation({
    mutationFn: (id: string) => {
      if (!token) throw new Error("Authentication required");
      return jobListingsApi.remove(id, token);
    },
    onSuccess: (_, id) => {
      dispatch(removeJobListing(id));
      queryClient.invalidateQueries({ queryKey: ["jobListings"] });
    },
    onError: (err: any) => {
      dispatch(
        setError({
          message: err.message || "Failed to delete job listing",
          code: err.code || "DELETE_ERROR",
        })
      );
    },
  });

  // Publish job listing mutation
  const publishJobListingMutation = useMutation({
    mutationFn: (id: string) => {
      if (!token) throw new Error("Authentication required");
      return jobListingsApi.publish(id, token);
    },
    onSuccess: (data) => {
      dispatch(updateJobListing(data.jobListing));
      queryClient.invalidateQueries({ queryKey: ["jobListings"] });
      queryClient.invalidateQueries({
        queryKey: ["jobListing", data.jobListing.id],
      });
    },
    onError: (err: any) => {
      dispatch(
        setError({
          message: err.message || "Failed to publish job listing",
          code: err.code || "PUBLISH_ERROR",
        })
      );
    },
  });

  // Delist job listing mutation
  const delistJobListingMutation = useMutation({
    mutationFn: (id: string) => {
      if (!token) throw new Error("Authentication required");
      return jobListingsApi.delist(id, token);
    },
    onSuccess: (data) => {
      dispatch(updateJobListing(data.jobListing));
      queryClient.invalidateQueries({ queryKey: ["jobListings"] });
      queryClient.invalidateQueries({
        queryKey: ["jobListing", data.jobListing.id],
      });
    },
    onError: (err: any) => {
      dispatch(
        setError({
          message: err.message || "Failed to delist job listing",
          code: err.code || "DELIST_ERROR",
        })
      );
    },
  });

  // Select job listing
  const selectJobListing = useCallback(
    (listing: any) => {
      dispatch(setSelectedJobListing(listing));
    },
    [dispatch]
  );

  // Clear selected job listing
  const clearSelectedJobListing = useCallback(() => {
    dispatch(setSelectedJobListing(null));
  }, [dispatch]);

  // Clear all job listings
  const clearAllJobListings = useCallback(() => {
    dispatch(clearJobListings());
  }, [dispatch]);

  return {
    // State
    jobListings,
    selectedJobListing,
    isLoading,
    count,

    // Queries
    fetchJobListings,
    fetchJobListingsByOrganization,

    // Fetch job listing by id
    fetchJobListingById,

    // Create job listing
    createJobListing: createJobListingMutation.mutate,
    isCreating: createJobListingMutation.isPending,
    createSuccess: createJobListingMutation.isSuccess,
    createError: createJobListingMutation.error,

    // Update job listing
    updateJobListingFn: updateJobListingMutation.mutate,
    isUpdating: updateJobListingMutation.isPending,
    updateSuccess: updateJobListingMutation.isSuccess,
    updateError: updateJobListingMutation.error,

    // Delete job listing
    deleteJobListing: deleteJobListingMutation.mutate,
    isDeleting: deleteJobListingMutation.isPending,
    deleteSuccess: deleteJobListingMutation.isSuccess,
    deleteError: deleteJobListingMutation.error,

    // Publish job listing
    publishJobListing: publishJobListingMutation.mutate,
    isPublishing: publishJobListingMutation.isPending,
    publishSuccess: publishJobListingMutation.isSuccess,
    publishError: publishJobListingMutation.error,

    // Delist job listing
    delistJobListing: delistJobListingMutation.mutate,
    isDelisting: delistJobListingMutation.isPending,
    delistSuccess: delistJobListingMutation.isSuccess,
    delistError: delistJobListingMutation.error,

    // Utility functions
    selectJobListing,
    clearSelectedJobListing,
    clearAllJobListings,
  };
}
