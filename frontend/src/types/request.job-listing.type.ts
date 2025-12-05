import {
    WageInterval,
    LocationRequirement,
    ExperienceLevel,
    JobListingStatus,
    JobListingType,
} from './job-listing.type';

export interface CreateJobListingDto {
    organizationId: string;
    title: string;
    description: string;
    wage?: number;
    wageInterval?: WageInterval;
    stateAbbreviation?: string;
    city?: string;
    isFeatured?: boolean;
    locationRequirement: LocationRequirement;
    experienceLevel: ExperienceLevel;
    status?: JobListingStatus;
    type: JobListingType;
    postedAt?: string;
}

export interface UpdateJobListingDto {
    title?: string;
    description?: string;
    wage?: number;
    wageInterval?: WageInterval;
    stateAbbreviation?: string;
    city?: string;
    isFeatured?: boolean;
    locationRequirement?: LocationRequirement;
    experienceLevel?: ExperienceLevel;
    status?: JobListingStatus;
    type?: JobListingType;
    postedAt?: string;
}
