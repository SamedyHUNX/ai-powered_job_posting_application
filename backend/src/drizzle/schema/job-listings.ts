import {
  pgTable,
  varchar,
  text,
  integer,
  pgEnum,
  boolean,
  timestamp,
  index,
  uuid,
} from 'drizzle-orm/pg-core';
import { createdAt, id, updatedAt } from '../utils/schema-helpers';
import { OrganizationTable } from './organizations';
import { relations } from 'drizzle-orm';
import { JobListingApplicationTable } from './job-listing-application';

export const wageIntervals = ['hourly', 'yearly'] as const;
export const locationRequirements = ['in-office', 'hybrid', 'remote'] as const;
export const experienceLevels = ['junior', 'mid-level', 'senior'] as const;
export const jobListingStatuses = ['draft', 'published', 'delisted'] as const;
export const jobListingTypes = [
  'internship',
  'part-time',
  'full-time',
] as const;

// type WageInterval = (typeof wageIntervals)[number];
// type LocationRequirement = (typeof locationRequirements)[number];
// type ExperienceLevel = (typeof experienceLevels)[number];
// type JobListingStatus = (typeof jobListingStatuses)[number];
// type JobListingType = (typeof jobListingTypes)[number];

export const wageIntervalEnum = pgEnum(
  'job_listings_wage_interval',
  wageIntervals,
);

export const locationRequirementEnum = pgEnum(
  'job_listings_location_requirement',
  locationRequirements,
);

export const experienceLevelEnum = pgEnum(
  'job_listings_experience_level',
  experienceLevels,
);

export const jobListingStatusEnum = pgEnum(
  'job_listings_status',
  jobListingStatuses,
);

export const jobListingTypeEnum = pgEnum('job_listings_type', jobListingTypes);

export const JobListingTable = pgTable(
  'job-listings',
  {
    id,
    organizationId: uuid('organizationId')
      .references(() => OrganizationTable.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    title: varchar().notNull(),
    description: text().notNull(),
    wage: integer(),
    wageInterval: wageIntervalEnum(),
    stateAbbreviation: varchar(),
    city: varchar(),
    isFeatured: boolean().notNull().default(false),
    locationRequirement: locationRequirementEnum().notNull(),
    experienceLevel: experienceLevelEnum().notNull(),
    status: jobListingStatusEnum().notNull().default('draft'),
    type: jobListingTypeEnum().notNull(),
    postedAt: timestamp({ withTimezone: true }),
    createdAt,
    updatedAt,
  },
  (table) => [index().on(table.stateAbbreviation)],
);

export const jobListingReferences = relations(
  JobListingTable,
  ({ one, many }) => ({
    organization: one(OrganizationTable, {
      fields: [JobListingTable.organizationId],
      references: [OrganizationTable.id],
    }),
    applications: many(JobListingApplicationTable),
  }),
);
