import axios from "axios";
import { env } from "@/data/env/client";
import { CreateOrganizationDto, UpdateOrganizationDto } from "@/types/organization.type";
import {
    OrganizationResponse,
    OrganizationsListResponse,
    OrganizationDeleteResponse,
} from "@/types/response.organization.type";

const API_URL = env.NEXT_PUBLIC_API_URL;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const organizationsApi = {
    /**
     * Create a new organization
     */
    create: async (
        dto: CreateOrganizationDto,
        token: string,
        file?: File
    ): Promise<OrganizationResponse> => {
        const formData = new FormData();
        formData.append("orgName", dto.orgName);
        if (dto.imageUrl) {
            formData.append("imageUrl", dto.imageUrl);
        }
        if (file) {
            formData.append("logo", file);
        }

        const { data } = await api.post<OrganizationResponse>(
            "/organizations",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return data;
    },

    /**
     * Get all organizations with optional filtering
     */
    findAll: async (
        search?: string,
        isVerified?: boolean
    ): Promise<OrganizationsListResponse> => {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (isVerified !== undefined) params.append("isVerified", String(isVerified));

        const { data } = await api.get<OrganizationsListResponse>(
            `/organizations?${params.toString()}`
        );
        return data;
    },

    /**
     * Get organizations by user ID
     */
    findByUser: async (userId: string): Promise<OrganizationsListResponse> => {
        const { data } = await api.get<OrganizationsListResponse>(
            `/organizations/user/${userId}`
        );
        return data;
    },

    /**
     * Get a single organization by ID
     */
    findOne: async (id: string): Promise<OrganizationResponse> => {
        const { data } = await api.get<OrganizationResponse>(`/organizations/${id}`);
        return data;
    },

    /**
     * Update an organization
     */
    update: async (
        id: string,
        dto: UpdateOrganizationDto,
        token: string,
        file?: File
    ): Promise<OrganizationResponse> => {
        const formData = new FormData();
        if (dto.orgName) formData.append("orgName", dto.orgName);
        if (dto.imageUrl) formData.append("imageUrl", dto.imageUrl);
        if (dto.isVerified !== undefined) formData.append("isVerified", String(dto.isVerified));
        if (dto.isBanned !== undefined) formData.append("isBanned", String(dto.isBanned));
        if (file) {
            formData.append("logo", file);
        }

        const { data } = await api.patch<OrganizationResponse>(
            `/organizations/${id}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return data;
    },

    /**
     * Delete an organization
     */
    remove: async (id: string, token: string): Promise<OrganizationDeleteResponse> => {
        const { data } = await api.delete<OrganizationDeleteResponse>(
            `/organizations/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return data;
    },

    /**
     * Verify an organization
     */
    verify: async (id: string, token: string): Promise<OrganizationResponse> => {
        const { data } = await api.post<OrganizationResponse>(
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

    /**
     * Ban an organization
     */
    ban: async (id: string, token: string): Promise<OrganizationResponse> => {
        const { data } = await api.post<OrganizationResponse>(
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

    /**
     * Unban an organization
     */
    unban: async (id: string, token: string): Promise<OrganizationResponse> => {
        const { data } = await api.post<OrganizationResponse>(
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
