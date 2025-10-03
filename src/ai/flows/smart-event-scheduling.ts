'use server';

/**
 * @fileOverview AI-powered smart event scheduling flow.
 *
 * - suggestOptimalTime - A function that suggests an optimal time for a new event based on the user's existing schedule and preferences.
 * - SmartEventSchedulingInput - The input type for the suggestOptimalTime function.
 * - SmartEventSchedulingOutput - The return type for the suggestOptimalTime function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartEventSchedulingInputSchema = z.object({
  existingEvents: z.string().describe('The user\'s existing events in a string format.'),
  newEventDuration: z.string().describe('The duration of the new event in minutes.'),
  userPreferences: z.string().optional().describe('The user\'s preferences for scheduling events.'),
});
export type SmartEventSchedulingInput = z.infer<typeof SmartEventSchedulingInputSchema>;

const SmartEventSchedulingOutputSchema = z.object({
  suggestedTime: z.string().describe('The suggested optimal time for the new event.'),
  reasoning: z.string().describe('The reasoning behind the suggested time.'),
});
export type SmartEventSchedulingOutput = z.infer<typeof SmartEventSchedulingOutputSchema>;

export async function suggestOptimalTime(input: SmartEventSchedulingInput): Promise<SmartEventSchedulingOutput> {
  return smartEventSchedulingFlow(input);
}

const smartEventSchedulingPrompt = ai.definePrompt({
  name: 'smartEventSchedulingPrompt',
  input: {schema: SmartEventSchedulingInputSchema},
  output: {schema: SmartEventSchedulingOutputSchema},
  prompt: `You are an AI assistant that helps users schedule new events by suggesting the optimal time.

  Consider the user's existing events, the duration of the new event, and the user's preferences to find the best time slot.

  Existing Events: {{{existingEvents}}}
  New Event Duration: {{{newEventDuration}}} minutes
  User Preferences: {{{userPreferences}}}

  Suggest an optimal time for the new event and explain your reasoning.

  Output the suggested time and reasoning in a JSON format.
  Make sure that the "suggestedTime" is in ISO 8601 format.
  `,
});

const smartEventSchedulingFlow = ai.defineFlow(
  {
    name: 'smartEventSchedulingFlow',
    inputSchema: SmartEventSchedulingInputSchema,
    outputSchema: SmartEventSchedulingOutputSchema,
  },
  async input => {
    const {output} = await smartEventSchedulingPrompt(input);
    return output!;
  }
);
