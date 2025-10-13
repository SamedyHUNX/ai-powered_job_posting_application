import { varchar, pgTable } from 'drizzle-orm/pg-core';
import { createdAt, id, updatedAt } from '../utils/schema-helpers';
import { relations } from 'drizzle-orm';
import { JobListingTable } from './job-listings';
import { OrganizationUserSettingsTable } from './organization-user-settings';

export const OrganizationTable = pgTable('organizations', {
  id,
  name: varchar().notNull(),
  imageUrl: varchar(),
  createdAt,
  updatedAt,
});

export const OrganizationRelations = relations(
  OrganizationTable,
  ({ many }) => ({
    jobListings: many(JobListingTable),
    organizationUserSettings: many(OrganizationUserSettingsTable),
  }),
);
