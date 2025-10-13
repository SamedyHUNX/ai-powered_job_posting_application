import { varchar, pgTable, uuid } from 'drizzle-orm/pg-core';
import { UserTable } from './users';
import { createdAt, updatedAt } from '../utils/schema-helpers';
import { relations } from 'drizzle-orm';

export const UserResumeTable = pgTable('user_resumes', {
  userId: uuid('userId')
    .primaryKey()
    .references(() => UserTable.id),
  resumeFileUrl: varchar().notNull(),
  resumeFileKey: varchar().notNull(),
  aiSummary: varchar(),
  createdAt,
  updatedAt,
});

export const userResumeRelations = relations(UserResumeTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [UserResumeTable.userId],
    references: [UserTable.id],
  }),
}));
