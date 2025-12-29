import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setSelectedJobListing,
  clearSelection,
} from "@/store/slices/job-listings-slice";
import { jobListingsApi } from "@/lib/job-listings-api";
import { JobListing, JobListingRequest, JobListingResponse } from "@/types";

interface UseJobListingsParams {
  search?: string;
  organizationId?: string;
  status?: string;
  type?: string;
  locationRequirement?: string;
  experienceLevel?: string;
}

export function useJobListings(params?: UseJobListingsParams) {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const token = useAppSelector((state) => state.auth.token);
  const selectedJobListing = useAppSelector(
    (state) => state.jobListings.selectedJobListing
  );

  // Fetch all job listings with filters using useQuery
  const {
    data: jobListingsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["jobListings", params],
    queryFn: () =>
      jobListingsApi.findAll(
        params?.search,
        params?.organizationId,
        params?.status,
        params?.type,
        params?.locationRequirement,
        params?.experienceLevel
      ),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const jobListings = jobListingsData?.data.jobListings || [];
  const count = jobListingsData?.count || 0;

  // Fetch single job listing
  const useJobListing = (id: string) =>
    useQuery({
      queryKey: ["jobListing", id],
      queryFn: () => jobListingsApi.findOne(id),
      enabled: !!id,
      select: (data) => data.data.jobListings,
    });

  // Fetch job listings by organization
  const useJobListingsByOrganization = (organizationId: string) =>
    useQuery({
      queryKey: ["jobListings", "organization", organizationId],
      queryFn: () => jobListingsApi.findByOrganization(organizationId),
      enabled: !!organizationId,
    });

  // Create job listing mutation
  const createJobListingMutation = useMutation({
    mutationFn: (
      dto: Partial<JobListingRequest>
    ): Promise<JobListingResponse> => {
      if (!token) throw new Error("Authentication required");
      return jobListingsApi.create(dto, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobListings"] });
    },
  });

  // Update job listing mutation
  const updateJobListingMutation = useMutation({
    mutationFn: ({
      id,
      dto,
    }: {
      id: string;
      dto: Partial<JobListingRequest>;
    }) => {
      if (!token) throw new Error("Authentication required");
      return jobListingsApi.update(id, dto, token);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["jobListings"] });
      queryClient.invalidateQueries({
        queryKey: ["jobListing", data.data.jobListings[0].id],
      });
    },
  });

  // Delete job listing mutation
  const deleteJobListingMutation = useMutation({
    mutationFn: (id: string) => {
      if (!token) throw new Error("Authentication required");
      return jobListingsApi.remove(id, token);
    },
    onSuccess: (_, id) => {
      // Clear selection if deleted job was selected
      if (selectedJobListing?.id === id) {
        dispatch(clearSelection());
      }
      queryClient.invalidateQueries({ queryKey: ["jobListings"] });
    },
  });

  // Publish job listing mutation
  const publishJobListingMutation = useMutation({
    mutationFn: (id: string) => {
      if (!token) throw new Error("Authentication required");
      return jobListingsApi.publish(id, token);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["jobListings"] });
      queryClient.invalidateQueries({
        queryKey: ["jobListing", data.data.jobListings[0].id],
      });
    },
  });

  // Delist job listing mutation
  const delistJobListingMutation = useMutation({
    mutationFn: (id: string) => {
      if (!token) throw new Error("Authentication required");
      return jobListingsApi.delist(id, token);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["jobListings"] });
      queryClient.invalidateQueries({
        queryKey: ["jobListing", data.data.jobListings[0].id],
      });
    },
  });

  // Select job listing (Redux only)
  const selectJobListing = useCallback(
    (listing: JobListing | null) => {
      dispatch(setSelectedJobListing(listing));
    },
    [dispatch]
  );

  // Clear selected job listing (Redux only)
  const clearSelectedJobListing = useCallback(() => {
    dispatch(clearSelection());
  }, [dispatch]);

  return {
    // Query state from TanStack Query
    jobListings,
    count,
    isLoading,
    error,
    refetch,

    // Selected job listing from Redux
    selectedJobListing,
    selectJobListing,
    clearSelectedJobListing,

    // Additional query hooks
    useJobListing,
    useJobListingsByOrganization,

    // Mutations
    createJobListing: createJobListingMutation.mutate,
    createJobListingAsync: createJobListingMutation.mutateAsync,
    isCreating: createJobListingMutation.isPending,
    createSuccess: createJobListingMutation.isSuccess,
    createError: createJobListingMutation.error,

    updateJobListing: updateJobListingMutation.mutate,
    updateJobListingAsync: updateJobListingMutation.mutateAsync,
    isUpdating: updateJobListingMutation.isPending,
    updateSuccess: updateJobListingMutation.isSuccess,
    updateError: updateJobListingMutation.error,

    deleteJobListing: deleteJobListingMutation.mutate,
    deleteJobListingAsync: deleteJobListingMutation.mutateAsync,
    isDeleting: deleteJobListingMutation.isPending,
    deleteSuccess: deleteJobListingMutation.isSuccess,
    deleteError: deleteJobListingMutation.error,

    publishJobListing: publishJobListingMutation.mutate,
    publishJobListingAsync: publishJobListingMutation.mutateAsync,
    isPublishing: publishJobListingMutation.isPending,
    publishSuccess: publishJobListingMutation.isSuccess,
    publishError: publishJobListingMutation.error,

    delistJobListing: delistJobListingMutation.mutate,
    delistJobListingAsync: delistJobListingMutation.mutateAsync,
    isDelisting: delistJobListingMutation.isPending,
    delistSuccess: delistJobListingMutation.isSuccess,
    delistError: delistJobListingMutation.error,
  };
}
