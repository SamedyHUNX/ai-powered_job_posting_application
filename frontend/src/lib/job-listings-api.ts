import axios from 'axios';
import { env } from '@/data/env/client';
import {
    CreateJobListingDto,
    UpdateJobListingDto,
} from '@/types/request.job-listing.type';
import {
    JobListingResponse,
    JobListingsListResponse,
    JobListingDeleteResponse,
    CreateJobListingResponse,
} from '@/types/response.job-listing.type';

const API_URL = env.NEXT_PUBLIC_API_URL;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const jobListingsApi = {
    // Create job listing
    create: async (
        dto: CreateJobListingDto,
        token: string
    ): Promise<CreateJobListingResponse> => {
        const { data } = await api.post<CreateJobListingResponse>(
            '/job-listings',
            dto,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return data;
    },

    // Get all job listings with optional filtering
    findAll: async (
        search?: string,
        organizationId?: string,
        status?: string,
        type?: string,
        locationRequirement?: string,
        experienceLevel?: string
    ): Promise<JobListingsListResponse> => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (organizationId) params.append('organizationId', organizationId);
        if (status) params.append('status', status);
        if (type) params.append('type', type);
        if (locationRequirement)
            params.append('locationRequirement', locationRequirement);
        if (experienceLevel) params.append('experienceLevel', experienceLevel);

        const { data } = await api.get<JobListingsListResponse>(
            `/job-listings?${params.toString()}`
        );
        return data;
    },

    // Get job listings by organization ID
    findByOrganization: async (
        organizationId: string
    ): Promise<JobListingsListResponse> => {
        const { data } = await api.get<JobListingsListResponse>(
            `/job-listings?organizationId=${organizationId}`
        );
        return data;
    },

    // Get a single job listing by ID
    findOne: async (id: string): Promise<JobListingResponse> => {
        const { data } = await api.get<JobListingResponse>(`/job-listings/${id}`);
        return data;
    },

    // Update a job listing
    update: async (
        id: string,
        dto: UpdateJobListingDto,
        token: string
    ): Promise<JobListingResponse> => {
        const { data } = await api.patch<JobListingResponse>(
            `/job-listings/${id}`,
            dto,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return data;
    },

    // Delete a job listing
    remove: async (
        id: string,
        token: string
    ): Promise<JobListingDeleteResponse> => {
        const { data } = await api.delete<JobListingDeleteResponse>(
            `/job-listings/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return data;
    },

    // Publish a job listing
    publish: async (id: string, token: string): Promise<JobListingResponse> => {
        const { data } = await api.post<JobListingResponse>(
            `/job-listings/${id}/publish`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return data;
    },

    // Delist a job listing
    delist: async (id: string, token: string): Promise<JobListingResponse> => {
        const { data } = await api.post<JobListingResponse>(
            `/job-listings/${id}/delist`,
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
