
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Building, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ProjectCard from './ProjectCard';
import type { Project } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function NewProjectsListing() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/projects'); // Fetch all projects
        if (!res.ok) {
          throw new Error('Failed to fetch new projects');
        }
        const data = await res.json();
        if (data.success) {
          setProjects(data.data);
        } else {
          throw new Error(data.error || 'Could not load projects.');
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
      <Card className="shadow-xl border-none bg-gradient-to-br from-primary/10 via-background to-background">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit mb-4 shadow-lg">
            <Sparkles className="w-10 h-10" />
          </div>
          <CardTitle className="font-headline text-4xl text-primary">
            Discover New Projects
          </CardTitle>
          <CardDescription className="text-lg max-w-2xl mx-auto">
            Explore the latest and upcoming residential and commercial real estate developments. 
            Find your future home or investment opportunity here.
          </CardDescription>
        </CardHeader>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {renderSkeletons(6)}
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
         <div className="text-center py-16 border border-dashed rounded-lg">
          <Building className="w-20 h-20 mx-auto text-muted-foreground mb-6" />
          <h2 className="text-2xl font-semibold text-muted-foreground mb-2">No New Projects Listed Yet</h2>
          <p className="text-muted-foreground mb-6">
            Check back soon for exciting new developments in your area.
          </p>
        </div>
      )}
    </div>
  );
}
