import { sqliteTable, text, integer, real, blob } from 'drizzle-orm/sqlite-core';

export const tontines = sqliteTable('tontines', {
  id: text('id').primaryKey(),
  type: text('type').$type<TontineType>().notNull(),
  savingGoalName: text('saving_goal_name').notNull(),
  savingGoalDescription: text('saving_goal_description'),
  savingGoalTargetAmount: integer('saving_goal_target_amount').notNull(),
  savingGoalImageUrl: text('saving_goal_image_url'),
  brickAmount: integer('brick_amount').notNull(),
  createdAt: integer('created_at').notNull(), // Store as Unix timestamp
  status: text('status').$type<'ACTIVE' | 'COMPLETED' | 'ARCHIVED'>().notNull(),
});

import { TontineType } from '../features/tontine/domain/Tontine';
