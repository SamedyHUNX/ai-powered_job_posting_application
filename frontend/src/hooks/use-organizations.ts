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
  const fetchOrganizations = async (search?: string, isVerified?: boolean) => {
    try {
      dispatch(setLoading(true));
      const { data, count } = await organizationsApi.findAll(
        search,
        isVerified
      );
      dispatch(
        setOrganizations({
          organizations: data.organizations,
          count,
        })
      );
    } catch (err: any) {
      dispatch(setError(err.message || "Failed to fetch organizations"));
    }
  };

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
    onError: (err: any) => {
      dispatch(setError(err.message || "Failed to fetch user organizations"));
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
    mutationFn: (id: string) => {
      if (!token) throw new Error("Authentication required");
      return organizationsApi.ban(id, token);
    },
    onSuccess: (data) => {
      dispatch(updateOrganization(data.organization));
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({
        queryKey: ["organization", data.organization.id],
      });
    },
    onError: (err: any) => {
      dispatch(setError(err.message || "Failed to ban organization"));
    },
  });

  // Unban organization mutation
  const unbanOrganizationMutation = useMutation({
    mutationFn: (id: string) => {
      if (!token) throw new Error("Authentication required");
      return organizationsApi.unban(id, token);
    },
    onSuccess: (data) => {
      dispatch(updateOrganization(data.organization));
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({
        queryKey: ["organization", data.organization.id],
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

    // Queries
    fetchOrganizations,
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

    // Mutations
    // updateOrganization: updateOrganizationMutation.mutate,
    // deleteOrganization: deleteOrganizationMutation.mutate,
    // verifyOrganization: verifyOrganizationMutation.mutate,
    // banOrganization: banOrganizationMutation.mutate,
    // unbanOrganization: unbanOrganizationMutation.mutate,

    // Mutation states
    // isUpdating: updateOrganizationMutation.isPending,
    // isDeleting: deleteOrganizationMutation.isPending,
    // isVerifying: verifyOrganizationMutation.isPending,
    // isBanning: banOrganizationMutation.isPending,
    // isUnbanning: unbanOrganizationMutation.isPending,

    // updateSuccess: updateOrganizationMutation.isSuccess,
    // deleteSuccess: deleteOrganizationMutation.isSuccess,
    // verifySuccess: verifyOrganizationMutation.isSuccess,
    // banSuccess: banOrganizationMutation.isSuccess,
    // unbanSuccess: unbanOrganizationMutation.isSuccess,

    // updateError: updateOrganizationMutation.error,
    // deleteError: deleteOrganizationMutation.error,
    // verifyError: verifyOrganizationMutation.error,
    // banError: banOrganizationMutation.error,
    // unbanError: unbanOrganizationMutation.error,

    // Utility functions
    selectOrganization,
    clearSelectedOrganization,
    clearAllOrganizations,
  };
}
