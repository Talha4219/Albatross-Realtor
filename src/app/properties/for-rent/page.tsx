
"use client";

import React, { useState, useEffect } from 'react';
import PropertyCard from '@/components/property/PropertyCard';
import type { Property } from '@/types';
import { Button } from '@/components/ui/button';
import { Home, Frown, Loader2, AlertTriangle } from 'lucide-react'; // Changed Building to Home
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const ITEMS_PER_PAGE = 9;

export default function ForRentPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/properties?status=For Rent');
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: `Failed to fetch properties: ${res.statusText}` }));
          throw new Error(errorData.error || `Network response was not ok: ${res.status}`);
        }
        const data = await res.json();
        if (data.success) {
          setProperties(data.data);
        } else {
          throw new Error(data.error || "Failed to fetch 'For Rent' properties: API success false");
        }
      } catch (err) {
        console.error("Error fetching 'For Rent' properties:", err);
        const specificError = err instanceof Error ? err.message : "Could not load property data.";
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
  }, [toast]);

  const totalPages = Math.ceil(properties.length / ITEMS_PER_PAGE);
  const paginatedProperties = properties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return (
      <div className="flex justify-center items-center space-x-2 mt-10 pt-6 border-t">
        <Button 
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
          disabled={currentPage === 1}
          variant="outline"
        >
          Previous
        </Button>
        {pageNumbers.slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2)).map(page => (
          <Button 
            key={page} 
            onClick={() => setCurrentPage(page)}
            variant={currentPage === page ? "default" : "outline"}
          >
            {page}
          </Button>
        ))}
        <Button 
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
          disabled={currentPage === totalPages}
          variant="outline"
        >
          Next
        </Button>
      </div>
    );
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
    <div className="space-y-8">
      <Card className="shadow-lg border-secondary/20 bg-gradient-to-br from-secondary/5 via-background to-background">
        <CardHeader className="text-center">
            <Home className="mx-auto h-12 w-12 text-primary mb-3" />
            <CardTitle className="text-4xl font-headline text-primary">Properties For Rent</CardTitle>
            <CardDescription className="text-lg text-muted-foreground max-w-xl mx-auto">
                Browse available apartments, houses, and commercial spaces for rent. Find your next ideal space.
            </CardDescription>
        </CardHeader>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderSkeletons(ITEMS_PER_PAGE)}
        </div>
      ) : error ? (
         <Card className="border-destructive bg-destructive/10">
            <CardHeader className="items-center text-center">
                <AlertTriangle className="mx-auto h-10 w-10 text-destructive mb-2" />
                <CardTitle className="font-headline text-destructive">Error Loading Properties</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-destructive-foreground">{error}</p>
                <Button onClick={() => window.location.reload()} variant="outline" className="mt-4 border-destructive text-destructive-foreground hover:bg-destructive/30">
                    Try Again
                </Button>
            </CardContent>
        </Card>
      ) : paginatedProperties.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          {renderPagination()}
        </>
      ) : (
         <div className="text-center py-16 border border-dashed rounded-lg bg-card">
            <Frown className="w-20 h-20 mx-auto text-muted-foreground mb-6" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">No Properties For Rent Currently</h2>
            <p className="text-muted-foreground">
                Please check back later or explore properties for sale.
            </p>
        </div>
      )}
    </div>
  );
}
