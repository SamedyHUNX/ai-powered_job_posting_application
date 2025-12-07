import { JobListing } from './job-listing.type';

export interface JobListingResponse {
    success: boolean;
    jobListing: JobListing;
}

export interface JobListingsListResponse {
    jobListings: JobListing[];
    count: number;
}

export interface JobListingDeleteResponse {
    success: boolean;
    message: string;
}

export interface CreateJobListingResponse {
    success: boolean;
    message: string;
    jobListing: JobListing;
}
