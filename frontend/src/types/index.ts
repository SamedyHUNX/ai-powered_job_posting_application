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

// AUTHENTICATION
export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  status: string;
  code: number;
  data: {
    user: User;
  };
  message: string;
}

export interface VerifyEmailResponse {
  code?: string;
  message: string;
}

export interface ForgotPasswordResponse {
  email: string;
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
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

export interface JobListingResponse {
  jobListing: JobListing;
  message: string;
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

export interface JobListingFormProps {
  // Core functionality
  onSubmit: (
    data: CreateJobListingFormData
  ) => Promise<CreateJobListingResponse>;
  defaultValues?: Partial<CreateJobListingFormData>;

  // Customization
  mode?: "create" | "edit";
  translations?: {
    validations?: any;
    labels?: Partial<Record<keyof CreateJobListingFormData, string>>;
    descriptions?: Partial<Record<keyof CreateJobListingFormData, string>>;
    buttons?: {
      submit?: string;
      submitting?: string;
    };
    options?: {
      wageIntervals?: Record<string, string>;
      locationRequirements?: Record<string, string>;
      jobTypes?: Record<string, string>;
      experienceLevels?: Record<string, string>;
      clearState?: string;
    };
  };

  // Layout & styling
  className?: string;
  buttonClassName?: string;
  showBorder?: boolean;

  // Field visibility/customization
  fields?: {
    show?: Partial<Record<keyof CreateJobListingFormData, boolean>>;
    disabled?: Partial<Record<keyof CreateJobListingFormData, boolean>>;
  };

  // Advanced
  validationSchema?: any;
  children?: (form: UseFormReturn<CreateJobListingFormData>) => React.ReactNode;

  // Additional props
  isLoading?: boolean;
  hideSubmitButton?: boolean;

  orgId?: string;
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

export interface OrganizationListTranslations {
  title: string;
  subTitle: string;
  loadingText: string;
  createOrganization: string;
  securedBy: string;
  contactSupport: string;
  nevermind: string;
  organizationBanned: {
    title: string;
    message: string;
  };
  verificationRequired: {
    title: string;
    message: string;
  };
  badges: {
    banned: string;
    unverified: string;
    verified: string;
  };
  memberCount: {
    singular: string;
    plural: string;
  };
  jobCount: {
    singular: string;
    plural: string;
  };
}

export interface OrganizationListProps {
  afterCreateOrganizationUrl?: ((org: Organization) => string) | string;
  afterSelectOrganizationUrl?: ((org: Organization) => string) | string;
  afterSelectPersonalUrl?: ((org: Organization) => string) | string;
  appearance?: {
    elements?: Record<string, string>;
    variables?: Record<string, string>;
  };
  fallback?: ReactNode;
  hidePersonal?: boolean;
  hideSlug?: boolean;
  skipInvitationScreen?: boolean;
  translations?: OrganizationListTranslations;
}

export interface CreateOrganizationDto {
  orgName: string;
  imageUrl?: string;
}

export interface UpdateOrganizationDto {
  orgName?: string;
  imageUrl?: string;
  isVerified?: boolean;
  isBanned?: boolean;
}

export interface CreateOrganizationResponse {
  message: string;
}

export interface OrganizationResponse {
  success: boolean;
  organization: Organization;
}

export interface OrganizationsListResponse {
  organizations: Organization[];
  count: number;
}

export interface OrganizationDeleteResponse {
  success: boolean;
  message: string;
}
