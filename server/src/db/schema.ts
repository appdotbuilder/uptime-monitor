
import { serial, text, pgTable, timestamp, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const statusEnum = pgEnum('status', ['up', 'down']);
export const notificationTypeEnum = pgEnum('notification_type', ['downtime', 'recovery']);

// Tables
export const monitorsTable = pgTable('monitors', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull(),
  name: text('name').notNull(),
  url: text('url').notNull(),
  check_interval: integer('check_interval').notNull().default(300), // seconds
  timeout: integer('timeout').notNull().default(10000), // milliseconds
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

export const statusChecksTable = pgTable('status_checks', {
  id: serial('id').primaryKey(),
  monitor_id: integer('monitor_id').notNull().references(() => monitorsTable.id, { onDelete: 'cascade' }),
  status: statusEnum('status').notNull(),
  response_time: integer('response_time'), // milliseconds
  status_code: integer('status_code'),
  error_message: text('error_message'),
  checked_at: timestamp('checked_at').defaultNow().notNull()
});

export const notificationsTable = pgTable('notifications', {
  id: serial('id').primaryKey(),
  monitor_id: integer('monitor_id').notNull().references(() => monitorsTable.id, { onDelete: 'cascade' }),
  type: notificationTypeEnum('type').notNull(),
  message: text('message').notNull(),
  is_sent: boolean('is_sent').notNull().default(false),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Relations
export const monitorsRelations = relations(monitorsTable, ({ many }) => ({
  statusChecks: many(statusChecksTable),
  notifications: many(notificationsTable)
}));

export const statusChecksRelations = relations(statusChecksTable, ({ one }) => ({
  monitor: one(monitorsTable, {
    fields: [statusChecksTable.monitor_id],
    references: [monitorsTable.id]
  })
}));

export const notificationsRelations = relations(notificationsTable, ({ one }) => ({
  monitor: one(monitorsTable, {
    fields: [notificationsTable.monitor_id],
    references: [monitorsTable.id]
  })
}));

// TypeScript types for the table schemas
export type Monitor = typeof monitorsTable.$inferSelect;
export type NewMonitor = typeof monitorsTable.$inferInsert;
export type StatusCheck = typeof statusChecksTable.$inferSelect;
export type NewStatusCheck = typeof statusChecksTable.$inferInsert;
export type Notification = typeof notificationsTable.$inferSelect;
export type NewNotification = typeof notificationsTable.$inferInsert;

// Export all tables for proper query building
export const tables = {
  monitors: monitorsTable,
  statusChecks: statusChecksTable,
  notifications: notificationsTable
};
