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
import { Organization, OrganizationsResponse } from "@/types";
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
  //   const fetchOrganizationsQuery = useQuery({
  //     queryKey: ["organizations"],
  //     queryFn: () => organizationsApi.findAll(),
  //     enabled: false, // Only fetch when explicitly called
  //   });

  // Fetch organizations with filters
  const fetchOrganizationsMutation = useMutation({
    mutationFn: (params: { search?: string; isVerified?: boolean }) =>
      organizationsApi.findAll(params.search, params.isVerified),

    onSuccess: (data) => {
      dispatch(
        setOrganizations({
          organizations: data.data.organizations,
          count: data.count,
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
    mutationFn: (userId: string) => organizationsApi.findByUser(userId),
    onSuccess: (data) => {
      dispatch(
        setOrganizations({
          organizations: data.data.organizations,
          count: data.count,
        })
      );
    },
    onError: (err: ApiError) => {
      dispatch(
        setError({ message: err.message || "Failed to fetch organization" })
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
    mutationFn: (formData: FormData) => {
      if (!token) throw new Error("Authentication required");
      return organizationsApi.create(formData, token);
    },
    onSuccess: (data) => {
      // dispatch(addOrganization(data.organization));
      // dispatch(setSelectedOrganization(data.organization));
      dispatch(setSuccess(data.message));
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
    onError: (err: any) => {
      dispatch(setError(err.message || "Failed to create organization"));
    },
  });

  // Update organization mutation
  // const updateOrganizationMutation = useMutation({
  //   mutationFn: ({
  //     id,
  //     dto,
  //     file,
  //   }: {
  //     id: string;
  //     dto: UpdateOrganizationDto;
  //     file?: File;
  //   }) => {
  //     if (!token) throw new Error("Authentication required");
  //     return organizationsApi.update(id, dto, token, file);
  //   },
  //   onSuccess: (data) => {
  //     dispatch(updateOrganization(data.organization));
  //     queryClient.invalidateQueries({ queryKey: ["organizations"] });
  //     queryClient.invalidateQueries({
  //       queryKey: ["organization", data.organization.id],
  //     });
  //   },
  //   onError: (err: any) => {
  //     dispatch(setError(err.message || "Failed to update organization"));
  //   },
  // });

  // Delete organization mutation
  // const deleteOrganizationMutation = useMutation({
  //   mutationFn: (id: string) => {
  //     if (!token) throw new Error("Authentication required");
  //     return organizationsApi.remove(id, token);
  //   },
  //   onSuccess: (_, id) => {
  //     dispatch(removeOrganization(id));
  //     queryClient.invalidateQueries({ queryKey: ["organizations"] });
  //   },
  //   onError: (err: any) => {
  //     dispatch(setError(err.message || "Failed to delete organization"));
  //   },
  // });

  // Verify organization mutation
  // const verifyOrganizationMutation = useMutation({
  //   mutationFn: (id: string) => {
  //     if (!token) throw new Error("Authentication required");
  //     return organizationsApi.verify(id, token);
  //   },
  //   onSuccess: (data) => {
  //     dispatch(updateOrganization(data.organization));
  //     queryClient.invalidateQueries({ queryKey: ["organizations"] });
  //     queryClient.invalidateQueries({
  //       queryKey: ["organization", data.organization.id],
  //     });
  //   },
  //   onError: (err: any) => {
  //     dispatch(setError(err.message || "Failed to verify organization"));
  //   },
  // });

  // Ban organization mutation
  const banOrganizationMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error("Authentication required");
      const { data } = await organizationsApi.ban(id, token);
      return data.organizations[0];
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
      const { data } = await organizationsApi.unban(id, token);
      return data.organizations[0];
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
    fetchOrganizations: fetchOrganizationByUserMutation.mutate,
    isFetchingOrganizations: fetchOrganizationByUserMutation.isPending,
    fetchOrganizationSuccess: fetchOrganizationByUserMutation.isSuccess,
    fetchOrganizationError: fetchOrganizationByUserMutation.error,

    // Queries
    fetchOrganizationQuery,

    // Create organization
    createOrganization: createOrganizationMutation.mutate,
    isCreating: createOrganizationMutation.isPending,
    createSuccess: createOrganizationMutation.isSuccess,
    createError: createOrganizationMutation.error,

    // Fetch organizations by userId
    fetchOrganizationsByUser: fetchOrganizationByUserMutation.mutate,
    isFetchingOrganizationsByUser: fetchOrganizationByUserMutation.isPending,
    fetchOrganizationsByUserSuccess: fetchOrganizationByUserMutation.isSuccess,
    isFetchingOrganizationsByUserError: fetchOrganizationByUserMutation.error,

    // Ban organization mutation
    banOrganization: banOrganizationMutation.mutate,
    isBanning: banOrganizationMutation.isPending,
    banSuccess: banOrganizationMutation.isSuccess,
    banError: banOrganizationMutation.error,

    // Unban organization mutation
    unbanOrganzation: unbanOrganizationMutation.mutate,
    isUnbanning: unbanOrganizationMutation.isPending,
    unbanSuccess: unbanOrganizationMutation.isSuccess,
    unbanError: unbanOrganizationMutation.isError,

    // Utility functions
    selectOrganization,
    clearSelectedOrganization,
    clearAllOrganizations,
  };
}
