import { varchar, pgTable, boolean } from 'drizzle-orm/pg-core';
import { createdAt, id, updatedAt } from '../utils/schema-helpers';
import { relations } from 'drizzle-orm';
import { JobListingTable } from './job-listings';
import { OrganizationUserSettingsTable } from './organization-user-settings';
import { timestamp } from 'drizzle-orm/pg-core';

export const OrganizationTable = pgTable('organizations', {
  id,
  name: varchar().notNull(),
  imageUrl: varchar('image_url'),
  isVerified: boolean('is_verified').default(false),
  isBanned: boolean('is_banned').default(false),
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
