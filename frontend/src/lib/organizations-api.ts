import axios from "axios";
import { env } from "@/data/env/client";
import { OrganizationsRequest, OrganizationsResponse } from "@/types";

const API_URL = env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create organization
export const organizationsApi = {
  create: async (
    formData: FormData,
    token: string
  ): Promise<Pick<OrganizationsResponse, "code" | "message">> => {
    const { data } = await api.post<
      Pick<OrganizationsResponse, "code" | "message">
    >("/organizations", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  },

  // Get all organizations with optional filtering
  findAll: async (
    search?: string,
    isVerified?: boolean
  ): Promise<OrganizationsResponse> => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (isVerified !== undefined)
      params.append("isVerified", String(isVerified));

    const { data } = await api.get<OrganizationsResponse>(
      `/organizations?${params.toString()}`
    );
    return data;
  },

  // Get organizations by user ID
  findByUser: async (userId: string): Promise<OrganizationsResponse> => {
    const { data } = await api.get<OrganizationsResponse>(
      `/organizations/user/${userId}`
    );
    return data;
  },

  // Get a single organization by ID
  findOne: async (
    id: string
  ): Promise<Pick<OrganizationsResponse, "code" | "message">> => {
    const { data } = await api.get<
      Pick<OrganizationsResponse, "code" | "message">
    >(`/organizations/${id}`);
    return data;
  },

  // Update an organization
  update: async (
    id: string,
    dto: Partial<OrganizationsRequest>,
    token: string,
    file?: File
  ): Promise<Pick<OrganizationsResponse, "code" | "message">> => {
    const formData = new FormData();
    if (dto.orgName) formData.append("orgName", dto.orgName);
    if (dto.imageUrl) formData.append("imageUrl", dto.imageUrl);
    if (dto.isVerified !== undefined)
      formData.append("isVerified", String(dto.isVerified));
    if (dto.isBanned !== undefined)
      formData.append("isBanned", String(dto.isBanned));
    if (file) {
      formData.append("logo", file);
    }

    const { data } = await api.patch<
      Pick<OrganizationsResponse, "code" | "message">
    >(`/organizations/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  },

  // Delete an organization
  remove: async (
    id: string,
    token: string
  ): Promise<Pick<OrganizationsResponse, "code" | "message">> => {
    const { data } = await api.delete<
      Pick<OrganizationsResponse, "code" | "message">
    >(`/organizations/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  },

  // Verify an organization
  verify: async (
    id: string,
    token: string
  ): Promise<Pick<OrganizationsResponse, "code" | "message">> => {
    const { data } = await api.post<
      Pick<OrganizationsResponse, "code" | "message">
    >(
      `/organizations/${id}/verify`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  },

  // Ban an organization
  ban: async (
    id: string,
    token: string
  ): Promise<Pick<OrganizationsResponse, "code" | "message">> => {
    const { data } = await api.post<
      Pick<OrganizationsResponse, "code" | "message">
    >(
      `/organizations/${id}/ban`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  },

  // Unban an organization
  unban: async (
    id: string,
    token: string
  ): Promise<Pick<OrganizationsResponse, "code" | "message" | "data">> => {
    const { data } = await api.post<
      Pick<OrganizationsResponse, "code" | "message" | "data">
    >(
      `/organizations/${id}/unban`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  },
};
