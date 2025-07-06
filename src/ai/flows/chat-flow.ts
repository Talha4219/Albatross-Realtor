
'use server';
/**
 * @fileOverview A conversational AI chat flow for real estate assistance.
 *
 * - chat - A function that handles the conversational chat process.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { Property } from '@/types';


// Define the schema for a single message in the chat history
const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']).describe('The role of the speaker.'),
  content: z.string().describe('The content of the message.'),
});

// Define the input schema for the chat flow
const ChatInputSchema = z.object({
  history: z.array(ChatMessageSchema).describe('The conversation history.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

// Define the output schema for the chat flow
const ChatOutputSchema = z.string().describe("The AI's response.");
export type ChatOutput = z.infer<typeof ChatOutputSchema>;


// The main exported function that clients will call
export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

// Define the tool for getting property listings
const getPropertyListingsTool = ai.defineTool(
  {
    name: 'getPropertyListings',
    description: 'Retrieves a list of real estate properties based on status (For Sale, For Rent) and location.',
    inputSchema: z.object({
      status: z.enum(['For Sale', 'For Rent']).describe("The listing status of the property."),
      location: z.string().describe("The city or area to search for properties in, e.g., 'Pleasantville, CA' or 'Metropolis'."),
    }),
    outputSchema: z.array(
      z.object({
        id: z.string(),
        address: z.string(),
        price: z.number(),
        bedrooms: z.number(),
        bathrooms: z.number(),
      })
    ).describe("A list of properties matching the criteria."),
  },
  async (input) => {
    console.log(`Tool called: Searching for properties ${input.status} in ${input.location}`);
    const query = new URLSearchParams({
      status: input.status,
      search: input.location,
    }).toString();

    // Use a relative path for the API call to work in any environment
    // NOTE: This assumes the flow is run from a server environment where it can resolve this relative path.
    const apiUrl = `/api/properties?${query}`;

    try {
      // In a server environment (like Next.js), you need to provide a base URL.
      // We assume a base URL from an environment variable, falling back to localhost.
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';
      const response = await fetch(new URL(apiUrl, baseUrl));

      if (!response.ok) {
          console.error(`Failed to fetch properties from API for tool. Status: ${response.status}`);
          return [];
      }
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
          // Return a simplified version of the property data for the AI
          return result.data.slice(0, 5).map((p: Property) => ({
              id: p.id,
              address: p.address,
              price: p.price,
              bedrooms: p.bedrooms,
              bathrooms: p.bathrooms,
          }));
      }
    } catch (error) {
        console.error("Error fetching properties for tool:", error);
    }
    return [];
  }
);


// Define the Genkit flow
const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {

    const systemPrompt = `You are Albatross, a friendly and expert real estate assistant for "Albatross Realtor".
Your goal is to help users find properties, navigate the website, and answer their real estate questions.

- Be concise, helpful, and maintain a positive and professional tone.
- Use the provided conversation history to understand the context.

- **NAVIGATIONAL GUIDANCE**:
  - If a user asks for properties in a general sense (e.g., "show me houses for sale"), guide them to the correct page. For example, "You can find all our properties for sale on the 'For Sale' page. Would you like me to take you there? [/properties/for-sale]".
  - For new projects, guide them to '/new-projects'. For market trends, guide them to '/market-trends'.
  - Format navigational links like this: \`[Link Text](url)\`.

- **PROPERTY SEARCH**:
  - If a user asks for specific properties (e.g., "find apartments for rent in Metropolis"), you MUST use the \`getPropertyListings\` tool to find them.
  - When you get results from the tool, present them as a friendly, formatted list. Include the address, price, beds, and baths. Most importantly, **provide a link to each property's detail page**, formatted like this: \`[View Details](/property/{{id}})\`.
  - If the tool returns an empty list, inform the user that you couldn't find any matching properties and suggest they try a broader search or browse the main property pages.
  - If the tool returns several properties, list them and also provide a link to the main search page for more options, like: "Here are a few I found... You can see more on our search page. [See all properties for rent](/properties/for-rent)".

- For general real estate questions, provide clear and accurate information.
- Keep your responses relatively short and easy to read.`;
    
    // The last message is the prompt for the model. The rest is history.
    const historyForModel = [...input.history];
    const lastUserMessage = historyForModel.pop();

    if (!lastUserMessage || lastUserMessage.role !== 'user') {
      return "I'm sorry, I'm having trouble understanding. Could you please rephrase your request?";
    }
    
    // Map the history to the format expected by the model
    const history = historyForModel.map(msg => ({
        role: msg.role,
        content: [{ text: msg.content }]
    }));

    const response = await ai.generate({
      prompt: lastUserMessage.content,
      system: systemPrompt,
      history: history,
      tools: [getPropertyListingsTool]
    });

    return response.text;
  }
);
