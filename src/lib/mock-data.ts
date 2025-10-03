import type { ScheduledEvent } from './types';
import { add, sub, set } from 'date-fns';

const today = new Date();

export const scheduledEvents: ScheduledEvent[] = [
  {
    id: '1',
    title: 'Team Standup',
    description: 'Daily sync with the development team.',
    start: set(today, { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 }),
    end: set(today, { hours: 9, minutes: 15, seconds: 0, milliseconds: 0 }),
    category: 'work',
  },
  {
    id: '2',
    title: 'Design Review',
    description: 'Review the new dashboard mockups.',
    start: set(today, { hours: 11, minutes: 0, seconds: 0, milliseconds: 0 }),
    end: set(today, { hours: 12, minutes: 30, seconds: 0, milliseconds: 0 }),
    category: 'meeting',
  },
  {
    id: '3',
    title: 'Focus Block: Code',
    description: 'Work on the AI integration feature.',
    start: set(today, { hours: 14, minutes: 0, seconds: 0, milliseconds: 0 }),
    end: set(today, { hours: 16, minutes: 0, seconds: 0, milliseconds: 0 }),
    category: 'focus-time',
  },
  {
    id: '4',
    title: 'Dentist Appointment',
    start: add(today, { days: 2, hours: 2 }),
    end: add(today, { days: 2, hours: 3 }),
    category: 'personal',
  },
  {
    id: '5',
    title: 'Project Kickoff',
    description: 'Kickoff meeting for the Q3 project.',
    start: add(today, { days: 1, hours: 5 }),
    end: add(today, { days: 1, hours: 6 }),
    category: 'work',
  },
  {
    id: '6',
    title: 'Weekly Report',
    description: 'Prepare and send the weekly progress report.',
    start: sub(today, { days: 3, hours: 4 }),
    end: sub(today, { days: 3, hours: 3, minutes: -30 }),
    category: 'work',
  },
   {
    id: '7',
    title: 'Lunch with Sarah',
    start: add(today, { days: 4, hours: -2}),
    end: add(today, { days: 4, hours: -1}),
    category: 'personal',
  },
];
