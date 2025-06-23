"use client";

import { useState, useEffect } from 'react';
import type { BlogPost } from '@/types';
import BlogPostCard from '@/components/blog/BlogPostCard';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, AlertTriangle, Frown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function BlogListingPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/blog/posts'); // Public endpoint for published posts
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: `Failed to fetch blog posts: ${res.statusText}` }));
        throw new Error(errorData.error || 'Network response was not ok');
      }
      const data = await res.json();
      if (data.success) {
        setPosts(data.data);
      } else {
        throw new Error(data.error || 'API returned success:false but no error message');
      }
    } catch (err) {
      console.error("Error fetching blog posts:", err);
      const specificError = err instanceof Error ? err.message : "Could not load blog posts.";
      setError(specificError);
      toast({
        title: "Error Fetching Posts",
        description: specificError,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPosts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <Card className="shadow-lg border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
        <CardHeader className="text-center">
            <BookOpen className="mx-auto h-12 w-12 text-primary mb-3" />
            <CardTitle className="text-4xl font-headline text-primary">Real Estate Blog</CardTitle>
            <CardDescription className="text-lg text-muted-foreground max-w-xl mx-auto">
                Articles, tips, and insights on the real estate market.
            </CardDescription>
        </CardHeader>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderSkeletons(6)}
        </div>
      ) : error ? (
         <Card className="border-destructive bg-destructive/10">
            <CardHeader className="items-center text-center">
                <AlertTriangle className="mx-auto h-10 w-10 text-destructive mb-2" />
                <CardTitle className="font-headline text-destructive">Error Loading Posts</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-destructive-foreground">{error}</p>
                <Button onClick={fetchPosts} variant="outline" className="mt-4 border-destructive text-destructive-foreground hover:bg-destructive/30">
                    Try Again
                </Button>
            </CardContent>
        </Card>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
         <div className="text-center py-16 border border-dashed rounded-lg bg-card">
            <Frown className="w-20 h-20 mx-auto text-muted-foreground mb-6" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">No Blog Posts Found</h2>
            <p className="text-muted-foreground">
                We haven't published any articles yet. Please check back later!
            </p>
        </div>
      )}
    </div>
  );
}
