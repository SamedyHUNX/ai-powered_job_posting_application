import { Organization } from "./organization.type";

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
