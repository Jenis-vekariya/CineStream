// src/ai/flows/generate-alternative-titles.ts
'use server';

/**
 * @fileOverview Generates alternative, similar-sounding, and possibly fake movie titles using AI.
 *
 * - generateAlternativeTitles - A function that generates alternative movie titles.
 * - GenerateAlternativeTitlesInput - The input type for the generateAlternativeTitles function.
 * - GenerateAlternativeTitlesOutput - The return type for the generateAlternativeTitles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAlternativeTitlesInputSchema = z.object({
  movieTitle: z.string().describe('The original movie title.'),
  genre: z.string().describe('The genre of the movie.'),
});
export type GenerateAlternativeTitlesInput = z.infer<typeof GenerateAlternativeTitlesInputSchema>;

const GenerateAlternativeTitlesOutputSchema = z.object({
  alternativeTitles: z.array(
    z.string().describe('An alternative, similar-sounding movie title.')
  ).describe('A list of alternative movie titles generated by AI.'),
});
export type GenerateAlternativeTitlesOutput = z.infer<typeof GenerateAlternativeTitlesOutputSchema>;

export async function generateAlternativeTitles(input: GenerateAlternativeTitlesInput): Promise<GenerateAlternativeTitlesOutput> {
  return generateAlternativeTitlesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAlternativeTitlesPrompt',
  input: {schema: GenerateAlternativeTitlesInputSchema},
  output: {schema: GenerateAlternativeTitlesOutputSchema},
  prompt: `You are a creative movie title generator. Given a movie title and its genre, you will generate a list of alternative movie titles that sound similar but may or may not be real.

Movie Title: {{{movieTitle}}}
Genre: {{{genre}}}

Generate 5 alternative movie titles:
`,
});

const generateAlternativeTitlesFlow = ai.defineFlow(
  {
    name: 'generateAlternativeTitlesFlow',
    inputSchema: GenerateAlternativeTitlesInputSchema,
    outputSchema: GenerateAlternativeTitlesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      alternativeTitles: output?.alternativeTitles ?? [],
    };
  }
);
