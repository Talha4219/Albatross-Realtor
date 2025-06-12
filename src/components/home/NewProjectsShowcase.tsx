
"use client";

import React, { useState, useEffect } from 'react';
import ProjectCard from '@/components/projects/ProjectCard';
import { Button } from '@/components/ui/button';
import type { Project } from '@/types';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton'; // For loading state
import { AlertTriangle, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FEATURED_PROJECTS_COUNT = 3; // Number of projects to showcase

export default function NewProjectsShowcase() {
  const [showcasedProjects, setShowcasedProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/projects'); // Fetch from the public endpoint
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: `Failed to fetch projects: ${res.statusText}` }));
          throw new Error(errorData.error || `Network response was not ok: ${res.status}`);
        }
        const data = await res.json();
        if (data.success) {
          // Filter for verified projects if needed, or projects with a specific status
          // For now, taking the first few from the fetched list.
          const projectsToDisplay = data.data.slice(0, FEATURED_PROJECTS_COUNT);
          setShowcasedProjects(projectsToDisplay);
        } else {
          throw new Error(data.error || "Failed to fetch projects: API success false");
        }
      } catch (err) {
        console.error("Error fetching projects for showcase:", err);
        const specificError = err instanceof Error ? err.message : "Could not load project data.";
        setError(specificError);
        toast({
          title: "Error Loading Projects",
          description: specificError,
          variant: "destructive",
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
    <section className="py-12 bg-muted/40">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary text-center mb-2">
          Discover New Real Estate Developments
        </h2>
        <p className="text-lg text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
          Explore verified new projects from trusted developers, perfect for buyers and investors.
        </p>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderSkeletons(FEATURED_PROJECTS_COUNT)}
          </div>
        ) : error ? (
          <div className="text-center py-10 text-destructive-foreground bg-destructive/10 p-4 rounded-md">
            <AlertTriangle className="mx-auto h-12 w-12 mb-4" />
            <p className="text-xl font-semibold">Failed to load new developments</p>
            <p>{error}</p>
          </div>
        ) : showcasedProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {showcasedProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            <Sparkles className="mx-auto h-12 w-12 mb-4" />
            <p className="text-xl">No new projects to display at the moment.</p>
            <p>Check back soon for exciting new developments!</p>
          </div>
        )}

        <div className="mt-10 text-center">
          <p className="font-semibold text-accent">All Projects Verified by Our Team</p>
          <p className="text-sm text-muted-foreground italic mt-1">
            [Partnered with Top Developers - Placeholder]
          </p>
        </div>

        <div className="mt-10 text-center space-y-4">
          <Button size="lg" variant="default" asChild className="font-headline">
            <Link href="/new-projects">View All New Projects</Link>
          </Button>
          <div className="text-sm text-muted-foreground space-x-4">
            <Link href="/agents/find" className="hover:text-primary hover:underline">[Find an Agent for Project Inquiries]</Link>
            <span className="text-muted-foreground/50">|</span>
            <Link href="/market-trends" className="hover:text-primary hover:underline">[Explore Market Trends]</Link>
          </div>
          <p className="text-xs text-muted-foreground italic">
            Have questions about new projects? Ask our AI! (Bottom Right) &rarr;
          </p>
        </div>
      </div>
    </section>
  );
}
