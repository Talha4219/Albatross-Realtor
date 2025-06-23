
"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MessageCircle, AlertTriangle, Loader2 } from 'lucide-react';
import type { Testimonial } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import TestimonialCard from '@/components/testimonials/TestimonialCard';
import Link from 'next/link';

export default function TestimonialsPage() {
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
        if (!res.ok) throw new Error('Failed to fetch testimonials');
        const data = await res.json();
        if (data.success) {
          setTestimonials(data.data);
        } else {
          throw new Error(data.error || 'Could not load testimonials.');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(errorMessage);
        toast({
          title: 'Error Loading Testimonials',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchTestimonials();
  }, [toast]);

  const renderSkeletons = (count: number) =>
    Array.from({ length: count }).map((_, index) => (
      <Card key={index} className="h-full flex flex-col">
        <CardHeader className="flex flex-row items-center gap-4 pb-3">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </CardHeader>
        <CardContent className="flex-grow space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    ));

  return (
    <div className="container mx-auto px-4 py-12">
        <Card className="w-full max-w-4xl mx-auto shadow-xl mb-12 text-center bg-gradient-to-br from-primary/5 via-background to-background">
            <CardHeader>
              <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit mb-4">
                <Star className="w-10 h-10" />
              </div>
              <CardTitle className="text-3xl font-headline">Client Testimonials</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                See what our satisfied clients have to say about their experience with Albatross Realtor.
              </CardDescription>
            </CardHeader>
             <CardContent>
                <Button asChild><Link href="/share-story">Share Your Story</Link></Button>
            </CardContent>
        </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderSkeletons(6)}
        </div>
      ) : error ? (
        <div className="text-center py-10 bg-destructive/10 text-destructive-foreground p-4 rounded-lg">
          <AlertTriangle className="mx-auto h-12 w-12 mb-4" />
          <h2 className="text-xl font-semibold">Failed to load testimonials</h2>
          <p>{error}</p>
        </div>
      ) : testimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed rounded-lg">
          <MessageCircle className="w-20 h-20 mx-auto text-muted-foreground mb-6" />
          <h2 className="text-2xl font-semibold text-muted-foreground mb-2">No Testimonials Yet</h2>
          <p className="text-muted-foreground mb-6">Be the first to share your experience with us!</p>
        </div>
      )}
    </div>
  );
}
