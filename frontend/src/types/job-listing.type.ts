export type WageInterval = "hourly" | "yearly" | "monthly";
export type LocationRequirement = "in-office" | "hybrid" | "remote";
export type ExperienceLevel =
  | "junior"
  | "mid"
  | "senior"
  | "lead"
  | "manager"
  | "ceo"
  | "director";
export type JobListingStatus = "draft" | "published" | "delisted";
export type JobListingType =
  | "internship"
  | "part-time"
  | "full-time"
  | "contract"
  | "freelance";

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

export const wageIntervals = ["hourly", "yearly", "monthly"] as const;
export const locationRequirements = ["in-office", "hybrid", "remote"] as const;
export const experienceLevels = [
  "junior",
  "mid",
  "senior",
  "lead",
  "ceo",
  "manager",
  "director",
] as const;
export const jobListingStatuses = ["draft", "published", "delisted"] as const;
export const jobListingTypes = [
  "internship",
  "part-time",
  "full-time",
  "contract",
  "freelance",
] as const;
