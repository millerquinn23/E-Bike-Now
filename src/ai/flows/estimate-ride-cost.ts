'use server';

/**
 * @fileOverview A ride cost estimation AI agent.
 *
 * - estimateRideCost - A function that estimates the cost of a ride.
 * - EstimateRideCostInput - The input type for the estimateRideCost function.
 * - EstimateRideCostOutput - The return type for the estimateRideCost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EstimateRideCostInputSchema = z.object({
  rentalTimeMinutes: z
    .number()
    .describe('The estimated rental time in minutes.'),
  distanceMiles: z.number().describe('The estimated distance in miles.'),
  demandLevel: z
    .string()
    .describe(
      'The current demand level, which can be low, medium, or high.'
    ),
});
export type EstimateRideCostInput = z.infer<typeof EstimateRideCostInputSchema>;

const EstimateRideCostOutputSchema = z.object({
  estimatedCost: z
    .number()
    .describe('The estimated cost of the ride in US dollars.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the estimated cost.'),
});
export type EstimateRideCostOutput = z.infer<typeof EstimateRideCostOutputSchema>;

export async function estimateRideCost(
  input: EstimateRideCostInput
): Promise<EstimateRideCostOutput> {
  return estimateRideCostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'estimateRideCostPrompt',
  input: {schema: EstimateRideCostInputSchema},
  output: {schema: EstimateRideCostOutputSchema},
  prompt: `You are an expert in estimating the cost of e-bike rentals. Consider rental time, distance, and demand.

  Provide a cost estimate (as a number) and reasoning for the cost.

  Rental Time (minutes): {{{rentalTimeMinutes}}}
  Distance (miles): {{{distanceMiles}}}
  Demand Level: {{{demandLevel}}}
  `,
});

const estimateRideCostFlow = ai.defineFlow(
  {
    name: 'estimateRideCostFlow',
    inputSchema: EstimateRideCostInputSchema,
    outputSchema: EstimateRideCostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
