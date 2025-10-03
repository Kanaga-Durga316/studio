'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Timer } from "lucide-react";

export default function FutureEventsPage() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex items-center gap-4 mb-6">
        <Timer className="h-8 w-8 text-primary" />
        <h1 className="text-2xl md:text-3xl font-bold">Future Events</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            This section will display all your upcoming scheduled events.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed shadow-sm p-8 text-center">
                <Timer className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">
                No Future Events... Yet!
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                Your upcoming events will appear here once they are scheduled.
                </p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
