
import React, { Suspense } from 'react';
import InsightsPageClient from './InsightsPageClient';
import type { Metadata } from 'next';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Neighborhood Insights | Albatross Realtor',
  description: 'Get AI-powered insights on schools, amenities, and market trends for any neighborhood.',
};

function InsightsLoading() {
    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">Loading Insights Tool...</p>
        </div>
    )
}

export default function InsightsPage() {
  return (
    <Suspense fallback={<InsightsLoading />}>
      <InsightsPageClient />
    </Suspense>
  );
}
