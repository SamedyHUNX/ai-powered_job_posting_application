export interface Organization {
  id: string;
  orgName: string;
  imageUrl: string;
  isVerified: boolean;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
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
