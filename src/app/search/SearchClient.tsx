
"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SearchIcon, Frown, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from "@/hooks/use-toast";
import PropertyCard from '@/components/property/PropertyCard';
import type { Property } from '@/types';
import { Button } from '@/components/ui/button';

export default function SearchClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProperties = async () => {
      if (!query) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/properties?search=${encodeURIComponent(query)}`);
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: `Search failed: ${res.statusText}` }));
          throw new Error(errorData.error || `Network response was not ok: ${res.status}`);
        }
        const data = await res.json();
        if (data.success) {
          setProperties(data.data);
        } else {
          throw new Error(data.error || "Failed to fetch search results: API success false");
        }
      } catch (err) {
        console.error("Error fetching search results:", err);
        const specificError = err instanceof Error ? err.message : "Could not load search results.";
        setError(specificError);
        toast({
          title: "Error Fetching Properties",
          description: specificError,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperties();
  }, [query, toast]);

  const renderSkeletons = (count: number) => (
    Array.from({ length: count }).map((_, index) => (
      <div key={index} className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <Skeleton className="h-48 w-full rounded-t-lg" />
        <div className="p-4 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    ))
  );

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
              Please enter a search term in the search bar above to begin.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderSkeletons(6)}
            </div>
          ) : error ? (
            <div className="text-center py-10 text-destructive-foreground bg-destructive/10 p-4 rounded-md">
              <AlertTriangle className="mx-auto h-8 w-8 mb-2" />
              <p>Could not load search results. {error}</p>
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : query ? (
            <div className="text-center py-16 border border-dashed rounded-lg bg-card">
              <Frown className="w-20 h-20 mx-auto text-muted-foreground mb-6" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">No Properties Found</h2>
              <p className="text-muted-foreground">
                We couldn't find any properties matching your search for "{query}". Try a different term.
              </p>
            </div>
          ) : (
            <p className="text-center py-10 text-muted-foreground">
              Your search results will appear here.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
