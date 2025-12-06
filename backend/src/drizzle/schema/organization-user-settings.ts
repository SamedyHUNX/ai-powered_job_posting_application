import {
  pgTable,
  varchar,
  boolean,
  integer,
  primaryKey,
  uuid,
} from 'drizzle-orm/pg-core';
import { UserTable } from './users';
import { OrganizationTable } from './organizations';
import { createdAt, updatedAt } from '../utils/schema-helpers';
import { relations } from 'drizzle-orm';

export const OrganizationUserSettingsTable = pgTable(
  'organization_user_settings',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => UserTable.id),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => OrganizationTable.id),
    role: varchar('role').notNull().default('Member'),
    newApplicationEmailNotifications: boolean(
      'new_application_email_notifications',
    )
      .notNull()
      .default(false),
    minimumRating: integer('minimum_rating'),
    createdAt,
    updatedAt,
  },
  (table) => [primaryKey({ columns: [table.userId, table.organizationId] })],
);

export const organizationUserSettingsRelations = relations(
  OrganizationUserSettingsTable,
  ({ one }) => ({
    user: one(UserTable, {
      fields: [OrganizationUserSettingsTable.userId],
      references: [UserTable.id],
    }),
    organization: one(OrganizationTable, {
      fields: [OrganizationUserSettingsTable.organizationId],
      references: [OrganizationTable.id],
    }),
  }),
);
