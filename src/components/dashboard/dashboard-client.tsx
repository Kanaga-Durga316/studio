"use client";

import { useState, useMemo, useTransition, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, isSameDay, parseISO } from "date-fns";
import {
  CalendarIcon,
  PlusCircle,
  AlertTriangle,
  Sparkles,
  Loader2,
  Edit,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import type { ScheduledEvent } from "@/lib/types";
import { scheduledEvents as initialEvents } from "@/lib/mock-data";
import { getAiSuggestion } from "@/lib/actions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "../ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

const eventSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required."),
  description: z.string().optional(),
  date: z.date({ required_error: "Date is required." }),
  time: z.string().min(1, "Time is required."),
  duration: z.coerce.number().positive("Duration must be a positive number."),
  preferences: z.string().optional(),
  category: z.enum(["personal", "work", "focus-time", "meeting"]),
});

type EventFormValues = z.infer<typeof eventSchema>;

type AiSuggestion = {
  suggestedTime: string;
  reasoning: string;
};

// Sub-component for the event creation/editing form
function EventForm({
  event,
  onSave,
  closeSheet,
}: {
  event?: ScheduledEvent | null;
  onSave: (event: ScheduledEvent) => void;
  closeSheet: () => void;
}) {
  const { toast } = useToast();
  const [isAiLoading, startAiTransition] = useTransition();
  const [aiSuggestion, setAiSuggestion] = useState<AiSuggestion | null>(null);

  const isEditing = !!event;

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
  });

  useEffect(() => {
    if (isEditing && event) {
      form.reset({
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.start,
        time: format(event.start, "HH:mm"),
        duration: (event.end.getTime() - event.start.getTime()) / 60000,
        category: event.category,
        preferences: "", // Preferences are not stored with the event
      });
    } else {
      form.reset({
        title: "",
        description: "",
        date: new Date(),
        time: format(new Date(), "HH:mm"),
        duration: 30,
        category: "meeting",
        preferences: "",
      });
    }
  }, [isEditing, event, form]);

  const onSubmit: SubmitHandler<EventFormValues> = (data) => {
    const [hours, minutes] = data.time.split(":").map(Number);
    const startDate = new Date(data.date);
    startDate.setHours(hours, minutes);

    const endDate = new Date(startDate.getTime() + data.duration * 60000);

    const savedEvent: ScheduledEvent = {
      id: isEditing && event ? event.id : crypto.randomUUID(),
      title: data.title,
      description: data.description,
      start: startDate,
      end: endDate,
      category: data.category,
    };
    onSave(savedEvent);
    toast({
      title: isEditing ? "Event Updated" : "Event Created",
      description: `"${data.title}" has been ${isEditing ? 'updated' : 'added'}.`,
    });
    closeSheet();
  };

  const handleAiSuggest = () => {
    const formData = new FormData();
    formData.append("duration", form.getValues("duration").toString());
    formData.append("preferences", form.getValues("preferences") || "");

    startAiTransition(async () => {
      setAiSuggestion(null);
      const result = await getAiSuggestion(formData);
      if (result.success && result.data) {
        setAiSuggestion(result.data);
      } else {
        toast({
          variant: "destructive",
          title: "AI Suggestion Failed",
          description: result.error || "Could not generate a suggestion.",
        });
      }
    });
  };

  const applyAiSuggestion = () => {
    if (aiSuggestion) {
      const suggestedDate = parseISO(aiSuggestion.suggestedTime);
      form.setValue("date", suggestedDate, { shouldValidate: true });
      form.setValue("time", format(suggestedDate, "HH:mm"), {
        shouldValidate: true,
      });
      toast({
        title: "Suggestion Applied",
        description: "The suggested time has been set in the form.",
      });
      setAiSuggestion(null);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Event Title</Label>
        <Input id="title" {...form.register("title")} />
        {form.formState.errors.title && (
          <p className="text-sm text-destructive">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Controller
          control={form.control}
          name="category"
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              value={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="focus-time">Focus Time</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !form.watch("date") && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.watch("date") ? (
                  format(form.watch("date"), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={form.watch("date")}
                onSelect={(date) => date && form.setValue("date", date, { shouldValidate: true })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
           {form.formState.errors.date && (
            <p className="text-sm text-destructive">
              {form.formState.errors.date.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Input id="time" type="time" {...form.register("time")} />
          {form.formState.errors.time && (
            <p className="text-sm text-destructive">
              {form.formState.errors.time.message}
            </p>
          )}
        </div>
      </div>
      <Separator />
      {/* AI Scheduling Section */}
      <div className="space-y-4 rounded-lg border border-border/60 bg-background p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent-foreground fill-accent" />
          <h3 className="text-lg font-semibold">Smart Schedule</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              {...form.register("duration")}
            />
            {form.formState.errors.duration && (
              <p className="text-sm text-destructive">
                {form.formState.errors.duration.message}
              </p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="preferences">Preferences (optional)</Label>
          <Textarea
            id="preferences"
            placeholder="e.g., 'I prefer mornings', 'Not during lunch hours'"
            {...form.register("preferences")}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleAiSuggest}
          disabled={isAiLoading || !form.watch("duration")}
          className="w-full"
        >
          {isAiLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Suggest Optimal Time with AI
        </Button>
        {aiSuggestion && (
          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertTitle>AI Suggestion</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>
                <strong>Suggested Time:</strong>{" "}
                {format(
                  parseISO(aiSuggestion.suggestedTime),
                  "MMMM d, yyyy 'at' h:mm a"
                )}
              </p>
              <p>
                <strong>Reasoning:</strong> {aiSuggestion.reasoning}
              </p>
              <Button
                size="sm"
                className="mt-2"
                onClick={applyAiSuggestion}
              >
                Apply Suggestion
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </div>
       <Separator />
      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea id="description" {...form.register("description")} />
      </div>
      <SheetFooter>
        <SheetClose asChild>
          <Button variant="outline">Cancel</Button>
        </SheetClose>
        <Button type="submit">{isEditing ? "Save Changes" : "Create Event"}</Button>
      </SheetFooter>
    </form>
  );
}

// Main client component for the dashboard
export function DashboardClient() {
  const [events, setEvents] = useState<ScheduledEvent[]>(initialEvents);
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduledEvent | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSaveEvent = (eventToSave: ScheduledEvent) => {
    setEvents(prev => {
        const eventExists = prev.some(e => e.id === eventToSave.id);
        if (eventExists) {
            return prev.map(e => e.id === eventToSave.id ? eventToSave : e).sort((a,b) => a.start.getTime() - b.start.getTime());
        } else {
            return [...prev, eventToSave].sort((a,b) => a.start.getTime() - b.start.getTime());
        }
    })
  };
  
  const handleCreateNewEvent = () => {
    setEditingEvent(null);
    setIsSheetOpen(true);
  };

  const handleEditEvent = (event: ScheduledEvent) => {
    setEditingEvent(event);
    setIsSheetOpen(true);
  };

  const todaysEvents = useMemo(() => {
    return selectedDay
      ? events.filter((event) => isSameDay(event.start, selectedDay))
      : [];
  }, [events, selectedDay]);

  const categoryColors = {
    personal: "bg-green-200 text-green-800",
    work: "bg-blue-200 text-blue-800",
    "focus-time": "bg-purple-200 text-purple-800",
    meeting: "bg-yellow-200 text-yellow-800",
  };

  if (!isClient) {
    return (
       <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="flex h-screen w-full flex-col">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <h1 className="text-xl font-semibold">Calendar</h1>
        <div className="ml-auto">
          <Button onClick={handleCreateNewEvent}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </div>
      </header>

      <main className="flex-1 p-4 sm:px-6 sm:py-0 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-0">
               <div className="flex items-center justify-center">
                 <Calendar
                    mode="single"
                    selected={selectedDay}
                    onSelect={setSelectedDay}
                    className="scale-95"
                  />
               </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                Events for {selectedDay ? format(selectedDay, "MMMM d, yyyy") : "Today"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[65vh]">
                {todaysEvents.length > 0 ? (
                  <div className="space-y-4">
                    {todaysEvents.map((event) => (
                      <Card key={event.id} className="flex">
                        <div className="flex flex-col items-center justify-center p-4 border-r">
                           <div className="text-sm font-semibold">{format(event.start, "h:mm")}</div>
                           <div className="text-xs text-muted-foreground">{format(event.start, "a")}</div>
                        </div>
                        <div className="p-4 flex-1">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{event.title}</CardTitle>
                                <div className="flex items-center gap-2">
                                <Badge variant="outline" className={cn(categoryColors[event.category])}>
                                {event.category.replace("-", " ")}
                                </Badge>
                                 <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-6 w-6">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => handleEditEvent(event)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                            </div>
                          
                          {event.description && <p className="text-sm text-muted-foreground mt-1">{event.description}</p>}
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center h-48 rounded-lg border-2 border-dashed border-gray-300">
                    <CalendarIcon className="w-12 h-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">No events scheduled for this day.</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </main>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-lg w-[90vw]">
          <ScrollArea className="h-full pr-6">
            <SheetHeader>
              <SheetTitle>{editingEvent ? "Edit Event" : "Create a New Event"}</SheetTitle>
              <SheetDescription>
                {editingEvent ? "Update the details for your event." : "Fill out the details for your new event. Use the AI scheduler to find the perfect time."}
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <EventForm
                event={editingEvent}
                onSave={handleSaveEvent}
                closeSheet={() => setIsSheetOpen(false)}
              />
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
