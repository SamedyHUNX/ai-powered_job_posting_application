import { useEffect, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setSelectedOrganization,
  clearSelection,
} from "@/store/slices/organizations-slice";
import { organizationsApi } from "@/lib/organizations-api";
import { Organization, OrganizationsRequest } from "@/types";

interface UseOrganizationsParams {
  search?: string;
  isVerified?: boolean;
}

export function useOrganizations(params?: UseOrganizationsParams) {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const token = useAppSelector((state) => state.auth.token);
  const selectedOrganization = useAppSelector(
    (state) => state.organizations.selectedOrganization
  );

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
  }, [dispatch, selectedOrganization]);

  // Fetch organizations with filters using useQuery
  const {
    data: organizationsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["organizations", params],
    queryFn: () => organizationsApi.findAll(params?.search, params?.isVerified),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const organizations = organizationsData?.data.organizations || [];

  // Fetch organizations by user
  const useOrganizationsByUser = (userId: string) =>
    useQuery({
      queryKey: ["organizations", "user", userId],
      queryFn: () => organizationsApi.findByUser(userId),
      enabled: !!userId,
      select: (data) => data.data.organizations,
    });

  // Fetch single organization
  const useOrganization = (id: string) =>
    useQuery({
      queryKey: ["organization", id],
      queryFn: () => organizationsApi.findOne(id),
      enabled: !!id,
      select: (data) => data.data.organizations[0],
    });

  // Create organization mutation
  const createOrganizationMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      if (!token) throw new Error("Authentication required");
      return await organizationsApi.create(formData, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
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
      return await organizationsApi.update(id, dto, token, file);
    },
    onSuccess: (response) => {
      const organization = response.data.organizations[0];

      // Update selected organization if it was the one updated
      if (selectedOrganization?.id === organization.id) {
        dispatch(setSelectedOrganization(organization));
        localStorage.setItem(
          "selectedOrganization",
          JSON.stringify(organization)
        );
      }

      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({
        queryKey: ["organization", organization.id],
      });
    },
  });

  // Remove organization mutation
  const removeOrganizationMutation = useMutation({
    mutationFn: (id: string) => {
      if (!token) throw new Error("Authentication required");
      return organizationsApi.remove(id, token);
    },
    onSuccess: (_, id) => {
      // Clear selection if removed organization was selected
      if (selectedOrganization?.id === id) {
        dispatch(clearSelection());
        localStorage.removeItem("selectedOrganization");
      }

      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });

  // Verify organization mutation
  const verifyOrganizationMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error("Authentication required");
      return await organizationsApi.verify(id, token);
    },
    onSuccess: (response) => {
      const organization = response.data.organizations[0];

      // Update selected organization if it was verified
      if (selectedOrganization?.id === organization.id) {
        dispatch(setSelectedOrganization(organization));
        localStorage.setItem(
          "selectedOrganization",
          JSON.stringify(organization)
        );
      }

      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({
        queryKey: ["organization", organization.id],
      });
    },
  });

  // Ban organization mutation
  const banOrganizationMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error("Authentication required");
      return await organizationsApi.ban(id, token);
    },
    onSuccess: (response) => {
      const organization = response.data.organizations[0];

      // Update selected organization if it was banned
      if (selectedOrganization?.id === organization.id) {
        dispatch(setSelectedOrganization(organization));
        localStorage.setItem(
          "selectedOrganization",
          JSON.stringify(organization)
        );
      }

      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({
        queryKey: ["organization", organization.id],
      });
    },
  });

  // Unban organization mutation
  const unbanOrganizationMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error("Authentication required");
      return await organizationsApi.unban(id, token);
    },
    onSuccess: (response) => {
      const organization = response.data.organizations[0];

      // Update selected organization if it was unbanned
      if (selectedOrganization?.id === organization.id) {
        dispatch(setSelectedOrganization(organization));
        localStorage.setItem(
          "selectedOrganization",
          JSON.stringify(organization)
        );
      }

      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({
        queryKey: ["organization", organization.id],
      });
    },
  });

  // Select organization
  const selectOrganization = useCallback(
    (orgOrId: string | Organization) => {
      if (typeof orgOrId === "string") {
        const org = organizations.find((o: Organization) => o.id === orgOrId);
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
    dispatch(clearSelection());
    localStorage.removeItem("selectedOrganization");
  }, [dispatch]);

  return {
    // Query state from TanStack Query
    organizations,
    count: organizations.length,
    isLoading,
    error,
    refetch,

    // Selected organization from Redux
    selectedOrganization,
    selectOrganization,
    clearSelectedOrganization,

    // Additional query hooks
    useOrganization,
    useOrganizationsByUser,

    // Mutations
    createOrganization: createOrganizationMutation.mutate,
    createOrganizationAsync: createOrganizationMutation.mutateAsync,
    isCreating: createOrganizationMutation.isPending,
    createSuccess: createOrganizationMutation.isSuccess,
    createError: createOrganizationMutation.error,

    updateOrganization: updateOrganizationMutation.mutate,
    updateOrganizationAsync: updateOrganizationMutation.mutateAsync,
    isUpdating: updateOrganizationMutation.isPending,
    updateSuccess: updateOrganizationMutation.isSuccess,
    updateError: updateOrganizationMutation.error,

    removeOrganization: removeOrganizationMutation.mutate,
    removeOrganizationAsync: removeOrganizationMutation.mutateAsync,
    isRemoving: removeOrganizationMutation.isPending,
    removeSuccess: removeOrganizationMutation.isSuccess,
    removeError: removeOrganizationMutation.error,

    verifyOrganization: verifyOrganizationMutation.mutate,
    verifyOrganizationAsync: verifyOrganizationMutation.mutateAsync,
    isVerifying: verifyOrganizationMutation.isPending,
    verifySuccess: verifyOrganizationMutation.isSuccess,
    verifyError: verifyOrganizationMutation.error,

    banOrganization: banOrganizationMutation.mutate,
    banOrganizationAsync: banOrganizationMutation.mutateAsync,
    isBanning: banOrganizationMutation.isPending,
    banSuccess: banOrganizationMutation.isSuccess,
    banError: banOrganizationMutation.error,

    unbanOrganization: unbanOrganizationMutation.mutate,
    unbanOrganizationAsync: unbanOrganizationMutation.mutateAsync,
    isUnbanning: unbanOrganizationMutation.isPending,
    unbanSuccess: unbanOrganizationMutation.isSuccess,
    unbanError: unbanOrganizationMutation.error,
  };
}
