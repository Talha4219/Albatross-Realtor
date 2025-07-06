
"use client";

import React, { useState, useTransition } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Lightbulb } from 'lucide-react';
import type { NeighborhoodInsightsOutput } from '@/ai/flows/neighborhood-insights';

const FormSchema = z.object({
  location: z.string().min(3, { message: "Location must be at least 3 characters." }).max(100),
});
type FormData = z.infer<typeof FormSchema>;

interface NeighborhoodInsightsFormProps {
  onInsightsGenerated: (insights: NeighborhoodInsightsOutput | null, location: string, error?: string) => void;
  defaultLocation?: string;
  generateInsightsAction: (input: { location: string }) => Promise<NeighborhoodInsightsOutput>;
}

export default function NeighborhoodInsightsForm({ onInsightsGenerated, defaultLocation = "", generateInsightsAction }: NeighborhoodInsightsFormProps) {
  const [isPending, startTransition] = useTransition();
  
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      location: defaultLocation,
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    startTransition(async () => {
      try {
        const result = await generateInsightsAction({ location: data.location });
        onInsightsGenerated(result, data.location);
      } catch (error) {
        console.error("Error generating insights:", error);
        onInsightsGenerated(null, data.location, (error as Error).message || "Failed to generate insights.");
      }
    });
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-primary" />
          Get Neighborhood Insights
        </CardTitle>
        <CardDescription>
          Enter a location (e.g., "Clifton, Karachi") to get AI-powered insights on schools, amenities, and market trends.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Clifton, Karachi" {...field} className="text-base"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="w-full font-headline text-lg py-3">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Insights"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
