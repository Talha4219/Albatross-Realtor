
// src/ai/flows/neighborhood-insights.ts
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
  schools: z.string().describe('Information about schools in the neighborhood. If specific data was found via tools, integrate it here.'),
  amenities: z.string().describe('Information about amenities in the neighborhood, such as parks, restaurants, and shops. If specific data was found via tools, integrate it here.'),
  marketTrends: z.string().describe('Information about local market trends in the neighborhood, such as average home prices and inventory. If specific data was found via tools, integrate it here.'),
  summary: z.string().describe('A brief overall summary of the neighborhood based on the gathered insights.'),
});
export type NeighborhoodInsightsOutput = z.infer<typeof NeighborhoodInsightsOutputSchema>;

// Schema for our new tool
const SpecificDataToolInputSchema = z.object({
  location: z.string().describe('The location for which to fetch specific data, e.g., "Pleasantville, CA".')
});

const SpecificDataToolOutputSchema = z.object({
  specificSchools: z.string().optional().describe("Specific school information if available, e.g., 'Pleasantville High (Public, Grades 9-12), Oak Elementary (Public, Grades K-5)'."),
  specificAmenities: z.string().optional().describe("Specific amenity information if available, e.g., 'Pleasantville Community Park, The Daily Grind Cafe, Central Shopping Mall'."),
  specificMarketInfo: z.string().optional().describe("Specific market trend data if available, e.g., 'Average home price: $750,000. YoY increase: 3.5%. Current inventory: 15 homes.'"),
});

// Define the tool
const getSpecificNeighborhoodDataTool = ai.defineTool(
  {
    name: 'getSpecificNeighborhoodDataTool',
    description: 'Fetches specific, localized data about schools, amenities, and market trends for a given neighborhood. Use this tool to get fine-grained details that might not be in general knowledge.',
    inputSchema: SpecificDataToolInputSchema,
    outputSchema: SpecificDataToolOutputSchema,
  },
  async (input) => {
    // Simulate fetching data from a database or external API
    if (input.location.toLowerCase() === 'pleasantville, ca') {
      return {
        specificSchools: 'Pleasantville High (Public, Grades 9-12, Rating: A), Oak Elementary (Public, Grades K-5, Rating: B+). No private school data available through this tool.',
        specificAmenities: 'Pleasantville Community Park (includes dog park, playground), The Daily Grind Cafe, Central Shopping Mall (Anchor: Macys).',
        specificMarketInfo: 'Current median home price for 3-bed houses: $765,000. 6-month trend: +2.1%. Average days on market: 45.',
      };
    }
    // For other locations, simulate no specific data found by the tool
    return {
        specificSchools: undefined, // or "No specific school data found for this location via the tool."
        specificAmenities: undefined,
        specificMarketInfo: undefined,
    };
  }
);


export async function neighborhoodInsights(input: NeighborhoodInsightsInput): Promise<NeighborhoodInsightsOutput> {
  return neighborhoodInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'neighborhoodInsightsPrompt',
  input: {schema: NeighborhoodInsightsInputSchema},
  output: {schema: NeighborhoodInsightsOutputSchema},
  tools: [getSpecificNeighborhoodDataTool], // Make the tool available to the prompt
  prompt: `You are an expert real estate analyst providing insights about neighborhoods.
Your goal is to generate a comprehensive analysis for the location: {{{location}}}.

Cover the following aspects:
1.  Schools: Quality, types, notable institutions.
2.  Amenities: Parks, shopping, dining, entertainment, healthcare.
3.  Market Trends: Property values, recent sales activity, demand, future outlook.
4.  Summary: A brief overall summary of the neighborhood.

To gather specific local details for schools, amenities, or market trends for "{{{location}}}", you MUST use the 'getSpecificNeighborhoodDataTool'.
If the tool returns relevant data (e.g., specific school names, particular park features, or precise market figures), integrate this information thoughtfully into your descriptions for the respective sections.
If the tool does not provide specific data for an aspect or for the location, rely on your broader knowledge and publicly available information to provide valuable insights.

Ensure your response populates all fields in the requested output format (schools, amenities, marketTrends, summary).
Strive for a helpful, informative, and balanced overview.
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

