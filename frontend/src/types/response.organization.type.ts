import { Organization } from "./organization.type";

export interface CreateOrganizationResponse {
  message: string;
}

export interface OrganizationResponse {
  success: boolean;
  organization: Organization;
}

export interface OrganizationsListResponse {
  success: boolean;
  organizations: Organization[];
  count: number;
}

export interface OrganizationDeleteResponse {
  success: boolean;
  message: string;
}
