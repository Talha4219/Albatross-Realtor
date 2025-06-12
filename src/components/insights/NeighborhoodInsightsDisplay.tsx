"use client";

import type { NeighborhoodInsightsOutput } from '@/ai/flows/neighborhood-insights';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { School, ShoppingBag, TrendingUp, AlertCircle } from 'lucide-react';

interface NeighborhoodInsightsDisplayProps {
  insights: NeighborhoodInsightsOutput | null;
  error?: string | null;
}

export default function NeighborhoodInsightsDisplay({ insights, error }: NeighborhoodInsightsDisplayProps) {
  if (error) {
    return (
      <Card className="mt-8 border-destructive bg-destructive/10">
        <CardHeader>
          <CardTitle className="font-headline text-destructive flex items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            Error Generating Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!insights) {
    return null; 
  }

  return (
    <Card className="mt-8 shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-center text-primary">
          Neighborhood Insights for: <span className="text-accent">{/* Location could be passed here if known */}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible defaultValue="schools" className="w-full">
          <AccordionItem value="schools">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              <div className="flex items-center gap-2">
                <School className="w-5 h-5 text-primary" /> Schools
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-base prose dark:prose-invert max-w-none">
              <p>{insights.schools}</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="amenities">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" /> Amenities
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-base prose dark:prose-invert max-w-none">
              <p>{insights.amenities}</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="marketTrends">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" /> Market Trends
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-base prose dark:prose-invert max-w-none">
              <p>{insights.marketTrends}</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
