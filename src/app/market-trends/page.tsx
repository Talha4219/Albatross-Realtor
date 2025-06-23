
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, BarChartBig, AlertTriangle, Newspaper, Frown } from 'lucide-react';
import type { BlogPost } from '@/types';
import BlogPostCard from '@/components/blog/BlogPostCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

export default function MarketTrendsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/blog/posts?category=Market%20Trends");
      if (!res.ok) throw new Error("Failed to fetch market trends articles");
      const data = await res.json();
      if (data.success) {
        setPosts(data.data);
      } else {
        throw new Error(data.error || "Could not load articles.");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(msg);
      toast({ title: "Error", description: msg, variant: "destructive" });
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
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-primary" />
            Market Trends & Insights
          </CardTitle>
          <CardDescription className="text-lg">
            Explore property price trends, demand dynamics, and the latest articles from our experts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="text-center py-12 bg-secondary/30 rounded-lg">
            <BarChartBig className="w-24 h-24 mx-auto text-primary mb-6 opacity-50" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">Advanced Charts Coming Soon</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              We&apos;re working on bringing you detailed charts and visualizations for market trends.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Newspaper className="w-7 h-7 text-primary" />
            Latest Market Trends Articles
          </CardTitle>
          <CardDescription>
            In-depth analysis and articles about the real estate market.
          </CardDescription>
        </CardHeader>
        <CardContent>
           {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderSkeletons(3)}
            </div>
          ) : error ? (
            <div className="text-center py-10 text-destructive-foreground bg-destructive/10 p-4 rounded-md">
                <AlertTriangle className="mx-auto h-8 w-8 mb-2" />
                <p>Could not load articles. {error}</p>
                 <Button onClick={fetchPosts} variant="outline" className="mt-4 border-destructive text-destructive-foreground hover:bg-destructive/30">
                    Try Again
                </Button>
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(post => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
             <div className="text-center py-10 border border-dashed rounded-lg bg-card">
                <Frown className="w-20 h-20 mx-auto text-muted-foreground mb-6" />
                <h2 className="text-2xl font-semibold text-foreground mb-2">No Market Trend Articles Found</h2>
                <p className="text-muted-foreground">
                    No articles on market trends have been published yet. Check back soon!
                </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
