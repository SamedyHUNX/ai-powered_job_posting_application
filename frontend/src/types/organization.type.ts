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
