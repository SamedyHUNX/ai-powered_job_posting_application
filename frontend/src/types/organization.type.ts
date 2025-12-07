import { ReactNode } from "react";

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

