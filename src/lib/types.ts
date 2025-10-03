export type ScheduledEvent = {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  category: 'personal' | 'work' | 'focus-time' | 'meeting';
};
