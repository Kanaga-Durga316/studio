'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { History } from "lucide-react";

export default function PastEventsPage() {
  return (
    <div className="container mx-auto p-4 md:p-6">
       <div className="flex items-center gap-4 mb-6">
        <History className="h-8 w-8 text-primary" />
        <h1 className="text-2xl md:text-3xl font-bold">Past Events</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Event History</CardTitle>
          <CardDescription>
            This section will display all your past events.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed shadow-sm p-8 text-center">
                <History className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">
                    Looking Back
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                    Your past events will be recorded here for your reference.
                </p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
