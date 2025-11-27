export interface Organization {
  id: string;
  orgName: string;
  imageUrl: string | null;
  slug?: string | null;
  hasImage: boolean;
  isVerified: boolean;
  isBanned: boolean;
  membersCount: string;
  pendingInvitationsCount: string;
  adminDeleteEnabled: boolean;
  maxAllowedMemberships: string;
  jobsCount: string;
  createdAt: string;
  updatedAt: string;
  userRole?: "Admin" | "Member";
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
