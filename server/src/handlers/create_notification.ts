
import { type Notification } from '../schema';

interface CreateNotificationInput {
  monitor_id: number;
  type: 'downtime' | 'recovery';
  message: string;
}

export const createNotification = async (input: CreateNotificationInput): Promise<Notification> => {
  // This is a placeholder declaration! Real code should be implemented here.
  // The goal of this handler is creating a notification when a monitor status changes.
  // Should be called when a monitor goes down or recovers.
  return Promise.resolve({
    id: 0,
    monitor_id: input.monitor_id,
    type: input.type,
    message: input.message,
    is_sent: false,
    created_at: new Date()
  } as Notification);
};
