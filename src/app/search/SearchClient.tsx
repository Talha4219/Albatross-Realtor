
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Frown, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from "@/hooks/use-toast";
import PropertyCard from '@/components/property/PropertyCard';
import type { Property } from '@/types';
import SearchFilters, { type SearchFilterValues } from '@/components/search/SearchFilters';

export default function SearchClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper to extract all filters from URL
  const getFiltersFromParams = useCallback(() => {
    const params: Partial<SearchFilterValues> = {};
    for (const [key, value] of searchParams.entries()) {
      params[key as keyof SearchFilterValues] = value;
    }
    return params as SearchFilterValues;
  }, [searchParams]);

  const [initialFilters] = useState(getFiltersFromParams());

  const fetchProperties = useCallback(async (filters: SearchFilterValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.q) params.set('search', filters.q);
      
      (Object.keys(filters) as Array<keyof typeof filters>).forEach(key => {
        if (key !== 'q' && filters[key]) {
          params.set(key, filters[key]);
        }
      });
      
      const res = await fetch(`/api/properties?${params.toString()}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: `Search failed: ${res.statusText}` }));
        throw new Error(errorData.error || `Network response was not ok: ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setProperties(data.data);
      } else {
        throw new Error(data.error || "Failed to fetch search results.");
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
  }, [toast]);

  // Effect to fetch data whenever the URL's search parameters change
  useEffect(() => {
    fetchProperties(getFiltersFromParams());
  }, [searchParams, fetchProperties, getFiltersFromParams]);

  const handleSearch = (filters: SearchFilterValues) => {
    const params = new URLSearchParams();
     (Object.keys(filters) as Array<keyof typeof filters>).forEach(key => {
        if (filters[key]) {
          params.set(key, filters[key]);
        }
      });

    // Use router.push to update URL, which triggers the useEffect hook
    router.push(`/search?${params.toString()}`);
  };

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
      <SearchFilters onSearch={handleSearch} initialFilters={initialFilters} isLoading={isLoading} />
      
      <Card className="w-full shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Search Results</CardTitle>
          <CardDescription>
            {isLoading ? 'Loading...' : `Found ${properties.length} properties matching your criteria.`}
          </CardDescription>
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
          ) : (
            <div className="text-center py-16 border border-dashed rounded-lg bg-card">
              <Frown className="w-20 h-20 mx-auto text-muted-foreground mb-6" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">No Properties Found</h2>
              <p className="text-muted-foreground">
                Try adjusting your search filters to find what you're looking for.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
