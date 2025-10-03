import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Timer } from "lucide-react";

export default function FutureEventsPage() {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm m-4">
      <div className="flex flex-col items-center gap-1 text-center">
        <Timer className="h-12 w-12 text-muted-foreground" />
        <h3 className="text-2xl font-bold tracking-tight">
          Future Events
        </h3>
        <p className="text-sm text-muted-foreground">
          This feature is not yet implemented.
        </p>
      </div>
    </div>
  );
}
