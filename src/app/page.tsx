
"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import HeroSection from '@/components/home/HeroSection';
import PropertyCard from '@/components/property/PropertyCard';
import type { Property } from '@/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import NewProjectsShowcase from '@/components/home/NewProjectsShowcase';
import MarketTrendsShowcase from '@/components/home/MarketTrendsShowcase';
import WhyChooseUsSection from '@/components/home/WhyChooseUsSection';
import BlogPreviewSection from '@/components/home/BlogPreviewSection';
import { useToast } from "@/hooks/use-toast";

const TestimonialsShowcase = dynamic(() => import('@/components/home/TestimonialsShowcase'), {
  ssr: false,
  loading: () => (
    <div className="container mx-auto px-4 py-12">
      <Skeleton className="h-10 w-1/2 mx-auto mb-4" />
      <Skeleton className="h-6 w-3/4 mx-auto mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  ),
});

const FEATURED_ITEMS_COUNT = 3;

export default function HomePage() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/properties'); // Fetches only 'Approved' properties
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: `Failed to fetch properties: ${res.statusText}` }));
          throw new Error(errorData.error || `Network response was not ok: ${res.status}`);
        }
        const data = await res.json();
        if (data.success) {
          // Set featured properties
          const approvedFeatured = data.data.filter((p: Property) => p.id !== '5').slice(0, FEATURED_ITEMS_COUNT);
          setFeaturedProperties(approvedFeatured);
        } else {
          throw new Error(data.error || "Failed to fetch properties: API success false");
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast({
          title: "Error Fetching Properties",
          description: (error instanceof Error ? error.message : "Could not load property data."),
          variant: "destructive",
        });
        setFeaturedProperties([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperties();
  }, [toast]);
  
  const renderSkeletons = (count: number) => (
    Array.from({ length: count }).map((_, index) => (
      <div key={index} className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <Skeleton className="h-48 w-full rounded-t-lg" />
        <div className="p-4 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <div className="flex justify-between pt-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      </div>
    ))
  );

  return (
    <div className="space-y-0">
      <HeroSection />
      
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary text-center mb-2">
            Explore Featured Properties
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
            Discover handpicked, verified homes, plots, and commercial properties tailored to your needs.
          </p>
          
          {isLoading ? ( 
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}>
              {renderSkeletons(FEATURED_ITEMS_COUNT)}
            </div>
          ) : featuredProperties.length > 0 ? (
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}>
              {featuredProperties.map(property => (
                <PropertyCard key={`featured-${property.id}`} property={property} />
              ))}
            </div>
          ) : (
             <div className="text-center py-10 text-muted-foreground">No featured properties available at the moment.</div>
          )}

          <div className="mt-10 text-center">
            <p className="font-semibold text-accent">All Featured Properties are 100% Verified & Approved</p>
          </div>

          <div className="mt-10 text-center space-y-4">
            <Button size="lg" variant="default" asChild className="font-headline">
              <Link href="/properties/for-sale">See All Properties</Link>
            </Button>
             <div className="text-sm text-muted-foreground space-x-4">
              <Link href="/new-projects" className="hover:text-primary hover:underline">Explore New Projects</Link>
              <span className="text-muted-foreground/50">|</span>
              <Link href="/contact" className="hover:text-primary hover:underline">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>

      <NewProjectsShowcase />
      <MarketTrendsShowcase />
      <TestimonialsShowcase />
      <BlogPreviewSection />
      <WhyChooseUsSection />
    </div>
  );
}
