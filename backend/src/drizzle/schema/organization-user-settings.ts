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
    userId: uuid('userId')
      .notNull()
      .references(() => UserTable.id),
    organizationId: uuid('organizationId')
      .notNull()
      .references(() => OrganizationTable.id),
    role: varchar('role').notNull().default('Member'),
    newApplicationEmailNotifications: boolean().notNull().default(false),
    minimumRating: integer(),
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
