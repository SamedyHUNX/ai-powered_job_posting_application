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
} from "@/store/slices/organizations-slice";
import { organizationsApi } from "@/lib/organizations-api";
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from "@/types/organization.type";
import { is } from "zod/v4/locales";

export function useOrganization() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const token = useAppSelector((state) => state.auth.token);
  const { organizations, selectedOrganization, isLoading, error, count } =
    useAppSelector((state) => state.organizations);

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
      const response = await organizationsApi.findAll(search, isVerified);
      dispatch(
        setOrganizations({
          organizations: response.organizations,
          count: response.count,
        })
      );
    } catch (err: any) {
      dispatch(setError(err.message || "Failed to fetch organizations"));
    }
  };

  // Fetch organizations by user ID
  // const fetchOrganizationsByUser = async (userId: string) => {
  //   try {
  //     dispatch(setLoading(true));
  //     const response = await organizationsApi.findByUser(userId);
  //     dispatch(
  //       setOrganizations({
  //         organizations: response.organizations,
  //         count: response.count,
  //       })
  //     );
  //   } catch (err: any) {
  //     dispatch(setError(err.message || "Failed to fetch user organizations"));
  //   }
  // };

  const fetchOrganizationByUserMutation = useMutation({
    mutationFn: (userId: string) => organizationsApi.findByUser(userId),
    onSuccess: (data) => {
      dispatch(
        setOrganizations({
          organizations: data.organizations,
          count: data.count,
        })
      );
      // Automatically select the first organization if available
      if (data.organizations.length > 0) {
        dispatch(setSelectedOrganization(data.organizations[0]));
      }
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
      dispatch(addOrganization(data.organization));
      // Automatically select the newly created organization
      dispatch(setSelectedOrganization(data.organization));
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
    onError: (err: any) => {
      dispatch(setError(err.message || "Failed to create organization"));
    },
  });

  // Update organization mutation
  const updateOrganizationMutation = useMutation({
    mutationFn: ({
      id,
      dto,
      file,
    }: {
      id: string;
      dto: UpdateOrganizationDto;
      file?: File;
    }) => {
      if (!token) throw new Error("Authentication required");
      return organizationsApi.update(id, dto, token, file);
    },
    onSuccess: (data) => {
      dispatch(updateOrganization(data.organization));
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({
        queryKey: ["organization", data.organization.id],
      });
    },
    onError: (err: any) => {
      dispatch(setError(err.message || "Failed to update organization"));
    },
  });

  // Delete organization mutation
  const deleteOrganizationMutation = useMutation({
    mutationFn: (id: string) => {
      if (!token) throw new Error("Authentication required");
      return organizationsApi.remove(id, token);
    },
    onSuccess: (_, id) => {
      dispatch(removeOrganization(id));
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
    onError: (err: any) => {
      dispatch(setError(err.message || "Failed to delete organization"));
    },
  });

  // Verify organization mutation
  const verifyOrganizationMutation = useMutation({
    mutationFn: (id: string) => {
      if (!token) throw new Error("Authentication required");
      return organizationsApi.verify(id, token);
    },
    onSuccess: (data) => {
      dispatch(updateOrganization(data.organization));
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({
        queryKey: ["organization", data.organization.id],
      });
    },
    onError: (err: any) => {
      dispatch(setError(err.message || "Failed to verify organization"));
    },
  });

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
  const selectOrganization = (id: string) => {
    const org = organizations.find((o) => o.id === id);
    if (org) {
      dispatch(setSelectedOrganization(org));
    }
  };

  // Clear selected organization
  const clearSelectedOrganization = () => {
    dispatch(setSelectedOrganization(null));
  };

  // Clear all organizations
  const clearAllOrganizations = () => {
    dispatch(clearOrganizations());
  };

  return {
    // State
    organizations,
    selectedOrganization,
    isLoading,
    error,
    count,

    // Queries
    fetchOrganizations,
    fetchOrganizationsByUser: fetchOrganizationByUserMutation.mutate,
    isFetchingOrganizations: fetchOrganizationByUserMutation.isPending,
    isFetchingOrganizationsError: fetchOrganizationByUserMutation.error,
    fetchOrganizationQuery,

    // Mutations
    createOrganization: createOrganizationMutation.mutate,
    updateOrganization: updateOrganizationMutation.mutate,
    deleteOrganization: deleteOrganizationMutation.mutate,
    verifyOrganization: verifyOrganizationMutation.mutate,
    banOrganization: banOrganizationMutation.mutate,
    unbanOrganization: unbanOrganizationMutation.mutate,

    // Mutation states
    isCreating: createOrganizationMutation.isPending,
    isUpdating: updateOrganizationMutation.isPending,
    isDeleting: deleteOrganizationMutation.isPending,
    isVerifying: verifyOrganizationMutation.isPending,
    isBanning: banOrganizationMutation.isPending,
    isUnbanning: unbanOrganizationMutation.isPending,

    createSuccess: createOrganizationMutation.isSuccess,
    updateSuccess: updateOrganizationMutation.isSuccess,
    deleteSuccess: deleteOrganizationMutation.isSuccess,
    verifySuccess: verifyOrganizationMutation.isSuccess,
    banSuccess: banOrganizationMutation.isSuccess,
    unbanSuccess: unbanOrganizationMutation.isSuccess,

    createError: createOrganizationMutation.error,
    updateError: updateOrganizationMutation.error,
    deleteError: deleteOrganizationMutation.error,
    verifyError: verifyOrganizationMutation.error,
    banError: banOrganizationMutation.error,
    unbanError: unbanOrganizationMutation.error,

    // Utility functions
    selectOrganization,
    clearSelectedOrganization,
    clearAllOrganizations,
  };
}
