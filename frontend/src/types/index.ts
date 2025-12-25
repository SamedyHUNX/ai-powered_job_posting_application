import { CreateJobListingFormData } from "@/schemas/createJobListingSchema";
import { ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";

// USERS
export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  userRole: string;
  token: string;
}

export interface AuthRequest {
  email: string;
  password: string;
  name: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  status: string;
  code: number;
  message: string;
  data: UsersData;
}

export interface UsersData {
  users: User[];
}

// JOB LISTINGS
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

export interface JobListingRequest {
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

export interface JobListingResponse {
  success: string;
  code: number;
  message: string;
  data: {
    jobListing: JobListing[];
  };
  count: number;
}

// ORGANIZATIONS
export interface Organization {
  id: string;
  orgName: string;
  imageUrl: string; // imageUrl cannot be null
  slug: string; // slug cannot be null
  hasImage: boolean;
  membersCount: string;
  pendingInvitationsCount: string;
  jobsCount: string;
  isVerified: boolean;
  isBanned: boolean;
  userRole?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationsRequest {
  orgName: string;
  imageUrl: string | undefined;
  isVerified: boolean;
  isBanned: boolean;
}

export interface OrganizationsData {
  organizations: Organization[];
}

export interface OrganizationsResponse {
  status: string;
  message: string;
  code: number;
  data: OrganizationsData;
  count: number;
}
