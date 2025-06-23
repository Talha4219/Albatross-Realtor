
"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, AlertTriangle, Building } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ProjectCard from '@/components/projects/ProjectCard';
import type { Project } from '@/types';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function TrendingProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/projects?status=Trending');
        if (!res.ok) {
          throw new Error('Failed to fetch trending projects');
        }
        const data = await res.json();
        if (data.success) {
          setProjects(data.data);
        } else {
          throw new Error(data.error || 'Could not load trending projects.');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(errorMessage);
        toast({
          title: 'Error Loading Projects',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, [toast]);

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
            <TrendingUp className="mx-auto h-12 w-12 text-primary mb-3" />
            <CardTitle className="text-4xl font-headline text-primary">Trending New Projects</CardTitle>
            <CardDescription className="text-lg text-muted-foreground max-w-xl mx-auto">
                Discover the most popular and talked-about new real estate developments in the market right now.
            </CardDescription>
        </CardHeader>
      </Card>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {renderSkeletons(3)}
        </div>
      ) : error ? (
        <Card className="border-destructive bg-destructive/10 text-center py-10">
          <CardHeader>
            <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
            <CardTitle className="text-destructive">Error Loading Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive-foreground">{error}</p>
            <Button onClick={() => window.location.reload()} variant="destructive" className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
         <div className="text-center py-16 border border-dashed rounded-lg bg-card">
          <Building className="w-20 h-20 mx-auto text-muted-foreground mb-6" />
          <h2 className="text-2xl font-semibold text-muted-foreground mb-2">No Trending Projects Found</h2>
          <p className="text-muted-foreground mb-6">
            There are no projects marked as 'Trending' at the moment.
          </p>
          <Button asChild>
            <Link href="/new-projects">View All New Projects</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
