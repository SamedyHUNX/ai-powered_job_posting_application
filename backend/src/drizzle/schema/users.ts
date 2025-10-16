import { varchar, pgTable } from 'drizzle-orm/pg-core';
import { createdAt, id, updatedAt } from '../utils/schema-helpers';
import { relations } from 'drizzle-orm';
import { UserNotificationSettingsTable } from './user-notification-settings';
import { UserResumeTable } from './user-resume';
import { OrganizationUserSettingsTable } from './organization-user-settings';

export const UserTable = pgTable('users', {
  id,
  name: varchar().notNull(),
  imageUrl: varchar().notNull(),
  password: varchar().notNull(),
  email: varchar().notNull().unique(),
  createdAt,
  updatedAt,
});

export const userRelations = relations(UserTable, ({ one, many }) => ({
  notificationSettings: one(UserNotificationSettingsTable),
  resume: one(UserResumeTable),
  organizationUserSettings: many(OrganizationUserSettingsTable),
}));
