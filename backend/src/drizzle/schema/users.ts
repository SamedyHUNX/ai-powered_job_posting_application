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
  username: varchar('username').notNull(),
  imageUrl: varchar('image_url').notNull(),
  password: varchar().notNull(),
  email: varchar().notNull().unique(),
  firstName: varchar('first_name').notNull(),
  lastName: varchar('last_name').notNull(),
  fullName: varchar('full_name'),
  resetPasswordToken: varchar('reset_password_token'),
  resetPasswordExpires: timestamp('reset_password_expires'),
  tokenVersion: integer('token_version').notNull().default(0),
  isBanned: boolean('is_banned').default(false),
  isVerified: boolean('is_verified').default(false),
  isDisabled: boolean('is_disabled').default(false),
  isAdmin: boolean('is_admin').default(false),
  verificationToken: varchar('verification_token'),
  verificationExpires: timestamp('verification_expires', {
    withTimezone: true,
  }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const userRelations = relations(UserTable, ({ one, many }) => ({
  notificationSettings: one(UserNotificationSettingsTable),
  resume: one(UserResumeTable),
  organizationUserSettings: many(OrganizationUserSettingsTable),
}));
