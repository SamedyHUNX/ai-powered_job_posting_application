// Job Listing Type Definitions

export type WageInterval = 'hourly' | 'yearly';
export type LocationRequirement = 'in-office' | 'hybrid' | 'remote';
export type ExperienceLevel = 'junior' | 'mid-level' | 'senior';
export type JobListingStatus = 'draft' | 'published' | 'delisted';
export type JobListingType = 'internship' | 'part-time' | 'full-time';

export interface JobListingOrganization {
    id: string;
    orgName: string;
    imageUrl: string;
    slug: string;
}

export interface JobListing {
    id: string;
    organizationId: string;
    title: string;
    description: string;
    wage?: number;
    wageInterval?: WageInterval;
    stateAbbreviation?: string;
    city?: string;
    isFeatured: boolean;
    locationRequirement: LocationRequirement;
    experienceLevel: ExperienceLevel;
    status: JobListingStatus;
    type: JobListingType;
    postedAt?: string;
    createdAt: string;
    updatedAt: string;
    organization?: JobListingOrganization;
}
