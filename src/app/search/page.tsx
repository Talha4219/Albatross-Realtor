
"use client";

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SearchIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center gap-2">
            <SearchIcon className="w-8 h-8 text-primary" />
            Search Results
          </CardTitle>
          {query ? (
            <CardDescription className="text-lg">
              Showing results for: <span className="font-semibold text-accent">{query}</span>
            </CardDescription>
          ) : (
            <CardDescription className="text-lg">
              Please enter a search term to begin.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {query ? (
            <div>
              <p className="text-muted-foreground mb-4">
                Full site search functionality is under development. 
                In the future, comprehensive results from properties, agents, projects, and blog posts matching your query &quot;{query}&quot; will appear here.
              </p>
              <div className="space-y-2">
                <p className="font-medium">Quick Links based on your search:</p>
                <Button variant="link" asChild className="p-0 h-auto text-base">
                  <Link href={`/#property-search-section?location=${encodeURIComponent(query)}`}>Search for properties related to &quot;{query}&quot;</Link>
                </Button>
                <br />
                <Button variant="link" asChild className="p-0 h-auto text-base">
                  {/* Assuming a blog page might exist or could be created at /blog */}
                  <Link href={`/blog?search=${encodeURIComponent(query)}`}>Search blog posts for &quot;{query}&quot;</Link>
                </Button>
                 <br />
                <Button variant="link" asChild className="p-0 h-auto text-base">
                  {/* Assuming an agents page might exist or could be created at /agents/find */}
                  <Link href={`/agents/find?name=${encodeURIComponent(query)}`}>Search for agents named &quot;{query}&quot;</Link>
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">
              Enter a term in a search bar to find what you&apos;re looking for across the site.
            </p>
          )}
          <div className="mt-8">
            <Button asChild>
              <Link href="/">Go back to Homepage</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
