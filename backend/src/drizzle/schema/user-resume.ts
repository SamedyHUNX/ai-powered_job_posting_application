import { varchar, pgTable, uuid } from 'drizzle-orm/pg-core';
import { UserTable } from './users';
import { createdAt, updatedAt } from '../utils/schema-helpers';
import { relations } from 'drizzle-orm';

export const UserResumeTable = pgTable('user_resumes', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => UserTable.id),
  resumeFileUrl: varchar('resume_file_url').notNull(),
  resumeFileKey: varchar('resume_file_key').notNull(),
  aiSummary: varchar('ai_summary'),
  createdAt,
  updatedAt,
});

export const userResumeRelations = relations(UserResumeTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [UserResumeTable.userId],
    references: [UserTable.id],
  }),
}));
