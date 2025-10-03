'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Mail, Smartphone } from 'lucide-react';
import { scheduledEvents } from '@/lib/mock-data';
import type { ScheduledEvent } from '@/lib/types';
import { subMinutes, format, isFuture } from 'date-fns';

type Reminder = {
  id: string;
  eventTitle: string;
  eventStart: Date;
  reminderTime: Date;
  notifications: ScheduledEvent['notifications'];
};

export default function RemindersPage() {
  const upcomingReminders: Reminder[] = scheduledEvents
    .map(event => {
      if (!event.reminder) {
        return null;
      }
      const reminderTime = subMinutes(
        event.start,
        parseInt(event.reminder, 10)
      );
      if (!isFuture(reminderTime)) {
        return null;
      }
      return {
        id: `${event.id}-reminder`,
        eventTitle: event.title,
        eventStart: event.start,
        reminderTime,
        notifications: event.notifications,
      };
    })
    .filter((reminder): reminder is Reminder => reminder !== null)
    .sort((a, b) => a.reminderTime.getTime() - b.reminderTime.getTime());

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex items-center gap-4 mb-6">
        <Bell className="h-8 w-8 text-primary" />
        <h1 className="text-2xl md:text-3xl font-bold">Upcoming Reminders</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Notifications</CardTitle>
          <CardDescription>
            Here are all the reminders you have set for your upcoming events.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingReminders.length > 0 ? (
            <div className="space-y-4">
              {upcomingReminders.map(reminder => (
                <Card key={reminder.id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{reminder.eventTitle}</h3>
                      <p className="text-sm text-muted-foreground">
                        Event at: {format(reminder.eventStart, 'MMM d, h:mm a')}
                      </p>
                       <Badge variant="outline" className="mt-2 font-normal">
                        Reminds at:{' '}
                        <span className="font-semibold ml-1">
                          {format(reminder.reminderTime, 'MMM d, h:mm a')}
                        </span>
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      {reminder.notifications?.email && (
                        <Mail className="h-5 w-5 text-muted-foreground" title="Email notification enabled" />
                      )}
                      {reminder.notifications?.sms && (
                        <Smartphone
                          className="h-5 w-5 text-muted-foreground"
                          title="SMS notification enabled"
                        />
                      )}
                      {reminder.notifications?.push && (
                        <Bell className="h-5 w-5 text-muted-foreground" title="Push notification enabled" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed shadow-sm p-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">
                No Upcoming Reminders
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Set a reminder for an event, and it will appear here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
