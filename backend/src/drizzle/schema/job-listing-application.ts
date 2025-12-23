import {
  pgTable,
  uuid,
  integer,
  primaryKey,
  text,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { JobListingTable } from './job-listings';
import { UserTable } from './users';
import { createdAt, updatedAt } from '../../utils/schema-helpers';
import { relations } from 'drizzle-orm';

export const applicationStages = [
  'denied',
  'applied',
  'interviewed',
  'hired',
] as const;

export type ApplicationStage = (typeof applicationStages)[number];
export const applicationStageEnum = pgEnum(
  'job_listing_applications_state',
  applicationStages,
);

export const JobListingApplicationTable = pgTable(
  'job_listing_applications',
  {
    jobListingId: uuid()
      .references(() => JobListingTable.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    userId: uuid()
      .references(() => UserTable.id, { onDelete: 'cascade' })
      .notNull(),
    coverLetter: text(),
    rating: integer(),
    stage: applicationStageEnum().notNull().default('applied'),
    createdAt,
    updatedAt,
  },
  (table) => [primaryKey({ columns: [table.jobListingId, table.userId] })],
);

export const jobListingApplicationRelations = relations(
  JobListingApplicationTable,
  ({ one }) => ({
    jobListing: one(JobListingTable, {
      fields: [JobListingApplicationTable.jobListingId],
      references: [JobListingTable.id],
    }),
    user: one(UserTable, {
      fields: [JobListingApplicationTable.userId],
      references: [UserTable.id],
    }),
  }),
);
