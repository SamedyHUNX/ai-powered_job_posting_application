import { varchar, pgTable, boolean } from 'drizzle-orm/pg-core';
import { id } from '../utils/schema-helpers';
import { relations } from 'drizzle-orm';
import { JobListingTable } from './job-listings';
import { OrganizationUserSettingsTable } from './organization-user-settings';
import { timestamp } from 'drizzle-orm/pg-core';

export const OrganizationTable = pgTable('organizations', {
  id,
  orgName: varchar('org_name').notNull(),
  imageUrl: varchar('image_url'),
  slug: varchar('slug').unique(),
  hasImage: boolean('has_image').default(false),
  isVerified: boolean('is_verified').default(false),
  isBanned: boolean('is_banned').default(false),
  membersCount: varchar('members_count').default('0'),
  pendingInvitationsCount: varchar('pending_invitations_count').default('0'),
  adminDeleteEnabled: boolean('admin_delete_enabled').default(false),
  maxAllowedMemberships: varchar('max_allowed_memberships').default('5'),
  userOrgRole: varchar('user_role'),
  jobsCount: varchar('jobs_count').default('0'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const OrganizationRelations = relations(
  OrganizationTable,
  ({ many }) => ({
    jobListings: many(JobListingTable),
    organizationUserSettings: many(OrganizationUserSettingsTable),
  }),
);
