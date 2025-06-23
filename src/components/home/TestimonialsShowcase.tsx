
"use client";

import React, { useState, useEffect } from 'react';
import TestimonialCard from '@/components/testimonials/TestimonialCard';
import { Button } from '@/components/ui/button';
import type { Testimonial } from '@/types';
import Link from 'next/link';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { MessageCircle, Users, Edit3, AlertTriangle, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export default function TestimonialsShowcase() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTestimonials = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/testimonials');
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: `Failed to fetch testimonials: ${res.statusText}` }));
          throw new Error(errorData.error || `Network response was not ok: ${res.status}`);
        }
        const data = await res.json();
        if (data.success) {
          setTestimonials(data.data);
        } else {
          throw new Error(data.error || "Failed to fetch testimonials: API success false");
        }
      } catch (err) {
        console.error("Error fetching testimonials for showcase:", err);
        const specificError = err instanceof Error ? err.message : "Could not load testimonial data.";
        setError(specificError);
        toast({
          title: "Error Loading Testimonials",
          description: specificError,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchTestimonials();
  }, [toast]);

  const renderSkeletons = (count: number) => (
    Array.from({ length: count }).map((_, index) => (
      <CarouselItem key={`skeleton-${index}`} className="pl-4 md:basis-1/2 lg:basis-1/3">
        <div className="p-1 h-full">
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </CarouselItem>
    ))
  );

  if (isLoading) {
    return (
      <section className="py-12 bg-muted/40">
        <div className="container mx-auto px-4">
          <Skeleton className="h-10 w-1/2 mx-auto mb-4" />
          <Skeleton className="h-6 w-3/4 mx-auto mb-8" />
          <Carousel opts={{ align: "start" }} className="w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto">
            <CarouselContent className="-ml-4">
              {renderSkeletons(3)}
            </CarouselContent>
          </Carousel>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-muted/40">
        <div className="container mx-auto px-4 text-center text-destructive-foreground bg-destructive/10 p-6 rounded-md">
           <AlertTriangle className="mx-auto h-12 w-12 mb-4" />
            <p className="text-xl font-semibold">Failed to load testimonials</p>
            <p>{error}</p>
        </div>
      </section>
    );
  }
  
  if (testimonials.length === 0) {
     return (
       <section className="py-12 bg-muted/40">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <MessageCircle className="mx-auto h-12 w-12 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No Testimonials Yet</h2>
          <p>Be the first to share your experience!</p>
        </div>
      </section>
     );
  }

  return (
    <section className="py-12 bg-muted/40">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary text-center mb-2">
          Hear From Our Happy Clients
        </h2>
        <p className="text-lg text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
          See how buyers and sellers succeed with our verified listings and expert support.
        </p>

        <Carousel
          opts={{
            align: "start",
            loop: testimonials.length > 2, 
          }}
          className="w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto"
        >
          <CarouselContent className="-ml-4">
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <TestimonialCard testimonial={testimonial} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {testimonials.length > 1 && ( 
            <>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </>
          )}
        </Carousel>
        
        <div className="mt-10 text-center">
          <p className="font-semibold text-accent">All Testimonials from Verified Users</p>
          <p className="text-sm text-muted-foreground italic mt-1">
            [Platform Metrics: 4.9/5 Average Rating from 5K+ Reviews - Placeholder]
          </p>
        </div>

        <div className="mt-10 text-center space-y-4">
          <Button size="lg" variant="default" asChild className="font-headline">
            <Link href="/testimonials">Read More Stories</Link>
          </Button>
          <div className="text-sm text-muted-foreground space-x-2 sm:space-x-4">
            <Link href="/contact" className="hover:text-primary hover:underline inline-flex items-center gap-1">
              <Users className="w-4 h-4" /> Contact Us
            </Link>
            <span className="text-muted-foreground/50">|</span>
            <Link href="/share-story" className="hover:text-primary hover:underline inline-flex items-center gap-1">
              <Edit3 className="w-4 h-4" /> Share Your Story
            </Link>
          </div>
          <p className="text-xs text-muted-foreground italic">
            <MessageCircle className="w-3.5 h-3.5 inline-block mr-1" />
            Want to create your own success story? Ask our AI! (Bottom Right) &rarr;
          </p>
        </div>
      </div>
    </section>
  );
}
