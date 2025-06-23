"use client";

import React, { useState, useEffect } from 'react';
import BlogPostCard from '@/components/blog/BlogPostCard';
import { Button } from '@/components/ui/button';
import type { BlogPost } from '@/types';
import Link from 'next/link';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { BookOpen, MessageSquare, Edit3, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const FEATURED_POSTS_COUNT = 4;

export default function BlogPreviewSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/blog/posts');
        if (!res.ok) throw new Error("Failed to fetch blog posts");
        const data = await res.json();
        if (data.success) {
          setPosts(data.data.slice(0, FEATURED_POSTS_COUNT));
        } else {
          throw new Error(data.error || "API returned success:false");
        }
      } catch (err) {
        console.error("Error fetching posts for preview:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        toast({
          title: "Could Not Load Blog Posts",
          description: "There was an issue fetching the latest blog posts for the preview.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [toast]);

  const renderSkeletons = () => (
    [...Array(3)].map((_, i) => (
      <CarouselItem key={`skeleton-${i}`} className="pl-4 md:basis-1/2 lg:basis-1/3">
        <div className="p-1 h-full">
          <Skeleton className="h-80 w-full rounded-lg" />
        </div>
      </CarouselItem>
    ))
  );

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary text-center mb-2">
          Learn More with Our Real Estate Blog
        </h2>
        <p className="text-lg text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
          Get the latest guides, market insights, and tips to navigate your real estate journey with confidence.
        </p>

        <Carousel
          opts={{
            align: "start",
            loop: posts.length > 3,
          }}
          className="w-full max-w-xs sm:max-w-xl md:max-w-4xl lg:max-w-6xl mx-auto"
        >
          <CarouselContent className="-ml-4">
            {isLoading ? renderSkeletons() : posts.length > 0 ? posts.map((post) => (
              <CarouselItem key={post.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <BlogPostCard post={post} />
                </div>
              </CarouselItem>
            )) : null}
          </CarouselContent>
           {posts.length > 1 && (
            <>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </>
           )}
        </Carousel>

        {(error && !isLoading) && (
            <div className="text-center py-10 text-destructive-foreground bg-destructive/10 p-4 rounded-md">
                <AlertTriangle className="mx-auto h-8 w-8 mb-2" />
                <p>Could not load blog posts. {error}</p>
            </div>
        )}

        {(!error && !isLoading && posts.length === 0) && (
            <div className="text-center py-10 text-muted-foreground">
                <BookOpen className="mx-auto h-12 w-12 mb-4" />
                <p>No blog posts available yet. Check back soon!</p>
            </div>
        )}

        <div className="mt-10 text-center">
          <p className="font-semibold text-accent">All Articles Written by Real Estate Experts</p>
          <p className="text-sm text-muted-foreground italic mt-1">
            [Content Metrics: 100+ Articles Published | Read by 10K+ Monthly Visitors - Placeholder]
          </p>
        </div>

        <div className="mt-10 text-center space-y-4">
          <Button size="lg" variant="default" asChild className="font-headline">
            <Link href="/blog">Explore All Blog Posts</Link>
          </Button>
          <div className="text-sm text-muted-foreground space-x-2 sm:space-x-4">
            <Link href="/#ai-chat" className="hover:text-primary hover:underline inline-flex items-center gap-1">
              <MessageSquare className="w-4 h-4" /> Ask Our AI for Tips
            </Link>
            <span className="text-muted-foreground/50">|</span>
            <Link href="/agents/find" className="hover:text-primary hover:underline inline-flex items-center gap-1">
              <Edit3 className="w-4 h-4" /> Connect with an Agent
            </Link>
          </div>
          <p className="text-xs text-muted-foreground italic">
            <BookOpen className="w-3.5 h-3.5 inline-block mr-1" />
            Need real estate tips? Ask our AI! (Bottom Right) &rarr;
          </p>
        </div>
      </div>
    </section>
  );
}
