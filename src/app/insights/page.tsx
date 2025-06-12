"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import NeighborhoodInsightsForm from '@/components/insights/NeighborhoodInsightsForm';
import NeighborhoodInsightsDisplay from '@/components/insights/NeighborhoodInsightsDisplay';
import { neighborhoodInsights, type NeighborhoodInsightsOutput } from '@/ai/flows/neighborhood-insights'; // This is a server action

export default function InsightsPage() {
  const [insights, setInsights] = useState<NeighborhoodInsightsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [defaultLocation, setDefaultLocation] = useState('');

  useEffect(() => {
    const locationFromQuery = searchParams.get('location');
    if (locationFromQuery) {
      setDefaultLocation(locationFromQuery);
    }
  }, [searchParams]);

  const handleInsightsGenerated = (generatedInsights: NeighborhoodInsightsOutput | null, errorMessage?: string) => {
    setInsights(generatedInsights);
    setError(errorMessage || null);
  };

  // The neighborhoodInsights function is a server action, so it can be passed directly.
  // No need to wrap it further unless specific client-side logic is needed before calling.
  const generateInsightsAction = async (input: { location: string }): Promise<NeighborhoodInsightsOutput> => {
    return neighborhoodInsights(input);
  };


  return (
    <div className="space-y-8 py-8">
      <NeighborhoodInsightsForm 
        onInsightsGenerated={handleInsightsGenerated} 
        defaultLocation={defaultLocation}
        generateInsightsAction={generateInsightsAction}
      />
      { (insights || error) && <NeighborhoodInsightsDisplay insights={insights} error={error} /> }
    </div>
  );
}
