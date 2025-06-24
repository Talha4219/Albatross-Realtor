
import React, { Suspense } from 'react';
import SearchClient from './SearchClient';
import type { Metadata } from 'next';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Search Results | Albatross Realtor',
  description: 'Find properties based on your search criteria.',
};

function SearchLoading() {
    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">Loading search results...</p>
        </div>
    )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchClient />
    </Suspense>
  );
}
