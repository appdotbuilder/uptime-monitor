
import { z } from 'zod';

// Monitor schema
export const monitorSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  name: z.string(),
  url: z.string().url(),
  check_interval: z.number().int().min(60), // Minimum 60 seconds
  timeout: z.number().int().min(1000).max(30000), // 1-30 seconds in milliseconds
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Monitor = z.infer<typeof monitorSchema>;

// Status check schema
export const statusCheckSchema = z.object({
  id: z.number(),
  monitor_id: z.number(),
  status: z.enum(['up', 'down']),
  response_time: z.number().nullable(), // Response time in milliseconds
  status_code: z.number().nullable(), // HTTP status code
  error_message: z.string().nullable(),
  checked_at: z.coerce.date()
});

export type StatusCheck = z.infer<typeof statusCheckSchema>;

// Notification schema
export const notificationSchema = z.object({
  id: z.number(),
  monitor_id: z.number(),
  type: z.enum(['downtime', 'recovery']),
  message: z.string(),
  is_sent: z.boolean(),
  created_at: z.coerce.date()
});

export type Notification = z.infer<typeof notificationSchema>;

// Input schemas
export const createMonitorInputSchema = z.object({
  user_id: z.string(),
  name: z.string().min(1).max(255),
  url: z.string().url(),
  check_interval: z.number().int().min(60).default(300), // Default 5 minutes
  timeout: z.number().int().min(1000).max(30000).default(10000) // Default 10 seconds
});

export type CreateMonitorInput = z.infer<typeof createMonitorInputSchema>;

export const updateMonitorInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(255).optional(),
  url: z.string().url().optional(),
  check_interval: z.number().int().min(60).optional(),
  timeout: z.number().int().min(1000).max(30000).optional(),
  is_active: z.boolean().optional()
});

export type UpdateMonitorInput = z.infer<typeof updateMonitorInputSchema>;

export const createStatusCheckInputSchema = z.object({
  monitor_id: z.number(),
  status: z.enum(['up', 'down']),
  response_time: z.number().nullable(),
  status_code: z.number().nullable(),
  error_message: z.string().nullable()
});

export type CreateStatusCheckInput = z.infer<typeof createStatusCheckInputSchema>;

export const getMonitorStatusInputSchema = z.object({
  monitor_id: z.number(),
  limit: z.number().int().min(1).max(100).default(50)
});

export type GetMonitorStatusInput = z.infer<typeof getMonitorStatusInputSchema>;

export const getUserMonitorsInputSchema = z.object({
  user_id: z.string()
});

export type GetUserMonitorsInput = z.infer<typeof getUserMonitorsInputSchema>;

export const deleteMonitorInputSchema = z.object({
  id: z.number()
});

export type DeleteMonitorInput = z.infer<typeof deleteMonitorInputSchema>;

// Dashboard data schema
export const monitorStatsSchema = z.object({
  monitor: monitorSchema,
  latest_status: statusCheckSchema.nullable(),
  uptime_percentage: z.number(),
  total_checks: z.number(),
  successful_checks: z.number()
});

export type MonitorStats = z.infer<typeof monitorStatsSchema>;
