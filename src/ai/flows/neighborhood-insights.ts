
'use server';
/**
 * @fileOverview A neighborhood insights AI agent.
 *
 * - neighborhoodInsights - A function that handles the neighborhood insights process.
 * - NeighborhoodInsightsInput - The input type for the neighborhoodInsights function.
 * - NeighborhoodInsightsOutput - The return type for the neighborhoodInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NeighborhoodInsightsInputSchema = z.object({
  location: z.string().describe('The location to provide neighborhood insights for. This should include city and state, e.g., "Pleasantville, CA".'),
});
export type NeighborhoodInsightsInput = z.infer<typeof NeighborhoodInsightsInputSchema>;

const NeighborhoodInsightsOutputSchema = z.object({
  schools: z.string().describe('Information about schools in the neighborhood based on general knowledge.'),
  amenities: z.string().describe('Information about amenities in the neighborhood, such as parks, restaurants, and shops, based on general knowledge.'),
  marketTrends: z.string().describe('Information about local market trends in the neighborhood, such as average home prices and inventory, based on general knowledge.'),
  summary: z.string().describe('A brief overall summary of the neighborhood based on the gathered insights.'),
});
export type NeighborhoodInsightsOutput = z.infer<typeof NeighborhoodInsightsOutputSchema>;


export async function neighborhoodInsights(input: NeighborhoodInsightsInput): Promise<NeighborhoodInsightsOutput> {
  return neighborhoodInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'neighborhoodInsightsPrompt',
  input: {schema: NeighborhoodInsightsInputSchema},
  output: {schema: NeighborhoodInsightsOutputSchema},
  prompt: `You are an expert real estate analyst providing insights about neighborhoods.
Your goal is to generate a comprehensive analysis for the location: {{{location}}}.

Rely on your broad, general knowledge to provide valuable insights.

Cover the following aspects:
1.  Schools: Quality, types, notable institutions.
2.  Amenities: Parks, shopping, dining, entertainment, healthcare.
3.  Market Trends: Property values, recent sales activity, demand, future outlook.
4.  Summary: A brief overall summary of the neighborhood.

Ensure your response populates all fields in the requested output format (schools, amenities, marketTrends, summary).
Strive for a helpful, informative, and balanced overview. If you lack specific data for an area, provide general information that a potential homebuyer would find useful.
`,
});

const neighborhoodInsightsFlow = ai.defineFlow(
  {
    name: 'neighborhoodInsightsFlow',
    inputSchema: NeighborhoodInsightsInputSchema,
    outputSchema: NeighborhoodInsightsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('No output generated from neighborhood insights prompt.');
    }
    // Ensure all fields are present, providing defaults if necessary.
    // The prompt is designed to fill these, but as a fallback:
    return {
        schools: output.schools || "General school information for this area would be discussed here.",
        amenities: output.amenities || "General amenity information for this area would be discussed here.",
        marketTrends: output.marketTrends || "General market trend information for this area would be discussed here.",
        summary: output.summary || "A general summary of the neighborhood would be provided here.",
    };
  }
);
