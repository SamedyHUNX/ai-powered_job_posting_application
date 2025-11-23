import { varchar, pgTable, boolean } from 'drizzle-orm/pg-core';
import { createdAt, id, updatedAt } from '../utils/schema-helpers';
import { relations } from 'drizzle-orm';
import { UserNotificationSettingsTable } from './user-notification-settings';
import { UserResumeTable } from './user-resume';
import { OrganizationUserSettingsTable } from './organization-user-settings';
import { timestamp } from 'drizzle-orm/pg-core';
import { integer } from 'drizzle-orm/pg-core';

export const UserTable = pgTable('users', {
  id,
  name: varchar().notNull(),
  imageUrl: varchar().notNull(),
  password: varchar().notNull(),
  email: varchar().notNull().unique(),
  firstName: varchar().notNull(),
  lastName: varchar().notNull(),
  fullName: varchar(),
  resetPasswordToken: varchar('reset_password_token'),
  resetPasswordExpires: timestamp('reset_password_expires'),
  tokenVersion: integer('token_version').notNull().default(0),
  isBanned: boolean().default(false),
  isVerified: boolean().default(false),
  isDisabled: boolean().default(false),
  isAdmin: boolean().default(false),
  createdAt,
  updatedAt,
});

export const userRelations = relations(UserTable, ({ one, many }) => ({
  notificationSettings: one(UserNotificationSettingsTable),
  resume: one(UserResumeTable),
  organizationUserSettings: many(OrganizationUserSettingsTable),
}));
