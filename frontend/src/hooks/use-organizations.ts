import { useEffect, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setOrganizations,
  setSelectedOrganization,
  addOrganization,
  updateOrganization,
  removeOrganization,
  setLoading,
  setError,
  clearOrganizations,
  setSuccess,
} from "@/store/slices/organizations-slice";
import { organizationsApi } from "@/lib/organizations-api";
import {
  Organization,
  OrganizationsData,
  OrganizationsRequest,
  OrganizationsResponse,
} from "@/types";
import { ApiError } from "@/lib/api-error";

export function useOrganization() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const token = useAppSelector((state) => state.auth.token);
  const { organizations, selectedOrganization, isLoading, count } =
    useAppSelector((state) => state.organizations);

  // Restore selected organization from localStorage on mount
  useEffect(() => {
    if (!selectedOrganization) {
      const stored = localStorage.getItem("selectedOrganization");
      if (stored) {
        try {
          const org = JSON.parse(stored);
          dispatch(setSelectedOrganization(org));
        } catch (e) {
          localStorage.removeItem("selectedOrganization");
        }
      }
    }
  }, [dispatch]);

  // Fetch all organizations
  const fetchOrganizationsQuery = useQuery({
    queryKey: ["organizations"],
    queryFn: () => organizationsApi.findAll(),
    enabled: false, // Only fetch when explicitly called
  });

  // Fetch organizations with filters
  const fetchOrganizationsMutation = useMutation({
    mutationFn: async (params: { search?: string; isVerified?: boolean }) => {
      const response = await organizationsApi.findAll(
        params.search,
        params.isVerified
      );
      return response;
    },

    onSuccess: ({
      code,
      status,
      message,
      data,
      count,
    }: OrganizationsResponse) => {
      dispatch(
        setOrganizations({
          status,
          organizations: data.organizations,
          code,
          count: count,
          message,
        })
      );
    },

    onError: (err: ApiError) => {
      dispatch(
        setError({
          message: err.message || "Failed to fetch organizations",
          code: err.code || 9999,
        })
      );
    },
  });

  const fetchOrganizationByUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await organizationsApi.findByUser(userId);
      return response;
    },
    onSuccess: ({
      code,
      status,
      message,
      data,
      count,
    }: OrganizationsResponse) => {
      dispatch(
        setOrganizations({
          code,
          status,
          message,
          organizations: data.organizations,
          count,
        })
      );
    },
    onError: (err: ApiError) => {
      dispatch(
        setError({
          message: err.message || "Failed to fetch organization",
          code: err.code,
        })
      );
    },
  });

  // Fetch single organization
  const fetchOrganizationQuery = (id: string) =>
    useQuery({
      queryKey: ["organization", id],
      queryFn: () => organizationsApi.findOne(id),
      enabled: !!id,
    });

  // Create organization mutation
  const createOrganizationMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      if (!token) throw new Error("Authentication required");
      const response = await organizationsApi.create(formData, token);
      return response;
    },
    onSuccess: ({
      code,
      message,
      data,
    }: {
      code: number;
      message: string;
      data: OrganizationsData;
    }) => {
      dispatch(addOrganization(data.organizations[0]));
      // dispatch(setSelectedOrganization(data.organization));
      dispatch(setSuccess(message));
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
    onError: (err: ApiError) => {
      dispatch(
        setError({
          message: err.message || "Failed to create organization",
          code: err.code || 9999,
        })
      );
    },
  });

  // Update organization mutation
  const updateOrganizationMutation = useMutation({
    mutationFn: async ({
      id,
      dto,
      file,
    }: {
      id: string;
      dto: Partial<OrganizationsRequest>;
      file?: File;
    }) => {
      if (!token) throw new Error("Authentication required");
      const response = await organizationsApi.update(id, dto, token, file);
      return response.data.organizations[0];
    },
    onSuccess: (organization) => {
      dispatch(updateOrganization(organization));
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({
        queryKey: ["organization", organization.id],
      });
    },
    onError: (err: ApiError) => {
      dispatch(
        setError({
          message: err.message || "Failed to update organization",
          code: err.code || 9999,
        })
      );
    },
  });

  // Remove organization mutation
  const removeOrganizationMutation = useMutation({
    mutationFn: (id: string) => {
      if (!token) throw new Error("Authentication required");
      return organizationsApi.remove(id, token);
    },
    onSuccess: (_, id) => {
      dispatch(removeOrganization(id));
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
    onError: (err: ApiError) => {
      dispatch(
        setError({
          message: err.message || "Failed to remove organization",
          code: err.code || 9999,
        })
      );
    },
  });

  // Verify organization mutation
  const verifyOrganizationMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error("Authentication required");
      const response = await organizationsApi.verify(id, token);
      return response.data.organizations[0];
    },
    onSuccess: (organization) => {
      dispatch(updateOrganization(organization));
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({
        queryKey: ["organization", organization.id],
      });
    },
    onError: (err: ApiError) => {
      dispatch(
        setError({
          message: err.message || "Failed to verify organization",
          code: err.code || 9999,
        })
      );
    },
  });

  // Ban organization mutation
  const banOrganizationMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error("Authentication required");
      const response = await organizationsApi.ban(id, token);
      return response.data.organizations[0];
    },
    onSuccess: (organization) => {
      dispatch(updateOrganization(organization));
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({
        queryKey: ["organization", organization.id],
      });
    },
    onError: (err: any) => {
      dispatch(setError(err.message || "Failed to ban organization"));
    },
  });

  const unbanOrganizationMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error("Authentication required");
      const response = await organizationsApi.unban(id, token);
      return response.data.organizations[0];
    },
    onSuccess: (organization) => {
      dispatch(updateOrganization(organization));
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({
        queryKey: ["organization", organization.id],
      });
    },
    onError: (err: any) => {
      dispatch(setError(err.message || "Failed to unban organization"));
    },
  });

  // Select organization
  const selectOrganization = useCallback(
    (orgOrId: string | Organization) => {
      if (typeof orgOrId === "string") {
        const org = organizations.find((o) => o.id === orgOrId);
        if (org) {
          dispatch(setSelectedOrganization(org));
          localStorage.setItem("selectedOrganization", JSON.stringify(org));
        }
      } else {
        dispatch(setSelectedOrganization(orgOrId));
        localStorage.setItem("selectedOrganization", JSON.stringify(orgOrId));
      }
    },
    [dispatch, organizations]
  );

  // Clear selected organization
  const clearSelectedOrganization = useCallback(() => {
    dispatch(setSelectedOrganization(null));
    localStorage.removeItem("selectedOrganization");
  }, [dispatch]);

  // Clear all organizations
  const clearAllOrganizations = useCallback(() => {
    dispatch(clearOrganizations());
    localStorage.removeItem("selectedOrganization");
  }, [dispatch]);

  return {
    // State
    organizations,
    selectedOrganization,
    isLoading,
    count,

    // Fetch organizations
    fetchOrganizations: fetchOrganizationsMutation.mutate,
    isFetchingOrganizations: fetchOrganizationsMutation.isPending,
    fetchOrganizationSuccess: fetchOrganizationsMutation.isSuccess,
    fetchOrganizationError: fetchOrganizationsMutation.isError,

    // Queries
    fetchOrganizationQuery,
    fetchOrganizationsQuery,

    // Create organization
    createOrganization: createOrganizationMutation.mutate,
    isCreating: createOrganizationMutation.isPending,
    createSuccess: createOrganizationMutation.isSuccess,
    createError: createOrganizationMutation.isError,

    // Verify organization
    verifyOrganization: verifyOrganizationMutation.mutate,
    isVerifying: verifyOrganizationMutation.isPending,
    verifySuccess: verifyOrganizationMutation.isSuccess,
    verifyError: verifyOrganizationMutation.isError,

    // Fetch organizations by userId
    fetchOrganizationsByUser: fetchOrganizationByUserMutation.mutate,
    isFetchingOrganizationsByUser: fetchOrganizationByUserMutation.isPending,
    fetchOrganizationsByUserSuccess: fetchOrganizationByUserMutation.isSuccess,
    isFetchingOrganizationsByUserError: fetchOrganizationByUserMutation.isError,

    // Ban organization
    banOrganization: banOrganizationMutation.mutate,
    isBanning: banOrganizationMutation.isPending,
    banSuccess: banOrganizationMutation.isSuccess,
    banError: banOrganizationMutation.isError,

    // Unban organization
    unbanOrganzation: unbanOrganizationMutation.mutate,
    isUnbanning: unbanOrganizationMutation.isPending,
    unbanSuccess: unbanOrganizationMutation.isSuccess,
    unbanError: unbanOrganizationMutation.isError,

    // Update organization
    updateOrganization: updateOrganizationMutation.mutate,
    isUpdating: updateOrganizationMutation.isPending,
    updateSuccess: updateOrganizationMutation.isSuccess,
    updateError: updateOrganizationMutation.isError,

    // Remove organization
    removeOrganization: removeOrganizationMutation.mutate,
    isRemoving: removeOrganizationMutation.isPending,
    removeSuccess: removeOrganizationMutation.isSuccess,
    removeError: removeOrganizationMutation.isError,

    // Utility functions
    selectOrganization,
    clearSelectedOrganization,
    clearAllOrganizations,
  };
}
