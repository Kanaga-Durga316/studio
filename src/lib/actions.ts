"use server";

import { suggestOptimalTime } from "@/ai/flows/smart-event-scheduling.ts";
import { z } from "zod";
import { scheduledEvents } from "@/lib/mock-data";

const eventSuggestionSchema = z.object({
  duration: z.coerce.number().positive("Duration must be a positive number."),
  preferences: z.string().optional(),
});

/**
 * Invokes the AI flow to suggest an optimal time for a new event.
 * @param formData - The form data containing event duration and user preferences.
 * @returns An object with the success status and either the AI's suggestion or an error message.
 */
export async function getAiSuggestion(formData: FormData) {
  try {
    const validatedData = eventSuggestionSchema.parse({
      duration: formData.get("duration"),
      preferences: formData.get("preferences"),
    });

    // In a real app, you would fetch the user's actual calendar data.
    // For this demo, we use mock data.
    const aiResponse = await suggestOptimalTime({
      existingEvents: JSON.stringify(scheduledEvents),
      newEventDuration: validatedData.duration.toString(),
      userPreferences: validatedData.preferences,
    });

    return { success: true, data: aiResponse };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(", "),
      };
    }
    console.error("AI suggestion error:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
