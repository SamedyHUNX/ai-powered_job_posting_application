import { pgTable, varchar, boolean, uuid } from 'drizzle-orm/pg-core';
import { UserTable } from './users';
import { createdAt, updatedAt } from '../../utils/schema-helpers';
import { relations } from 'drizzle-orm';

export const UserNotificationSettingsTable = pgTable(
  'user_notification_settings',
  {
    userId: uuid('user_id')
      .primaryKey()
      .references(() => UserTable.id),
    newJobEmailNotifications: boolean('new_job_email_notifications')
      .notNull()
      .default(false),
    aiPrompt: varchar('ai_prompt'),
    createdAt,
    updatedAt,
  },
);

export const userNotificationSettingsRelations = relations(
  UserNotificationSettingsTable,
  ({ one }) => ({
    user: one(UserTable, {
      fields: [UserNotificationSettingsTable.userId],
      references: [UserTable.id],
    }),
  }),
);
