
"use client";

import { useState, useEffect } from 'react';
import type { Agent } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Users, AlertTriangle, Frown, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import AgentCard from '@/components/agents/AgentCard';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAgents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/agents');
      if (!res.ok) throw new Error("Failed to fetch agents list");
      const data = await res.json();
      if (data.success) {
        setAgents(data.data);
      } else {
        throw new Error(data.error || "Could not load agents.");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(msg);
      toast({ title: "Error Loading Agents", description: msg, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, [toast]);

  const renderSkeletons = (count: number) => (
    Array.from({ length: count }).map((_, index) => (
      <div key={index} className="rounded-lg border bg-card text-card-foreground shadow-sm h-full flex flex-col">
        <div className="p-6 bg-muted/20 items-center text-center">
            <Skeleton className="w-24 h-24 rounded-full mx-auto mb-3" />
            <Skeleton className="h-6 w-3/4 mx-auto mb-1" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
        </div>
        <div className="p-4 flex-grow space-y-2">
           <Skeleton className="h-4 w-full" />
           <Skeleton className="h-5 w-1/3 mx-auto" />
        </div>
         <div className="p-4 pt-0 border-t mt-auto">
            <Skeleton className="h-9 w-full" />
        </div>
      </div>
    ))
  );

  return (
    <div className="space-y-8">
      <Card className="shadow-lg border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
        <CardHeader className="text-center">
            <Users className="mx-auto h-12 w-12 text-primary mb-3" />
            <CardTitle className="text-4xl font-headline text-primary">Find an Agent</CardTitle>
            <CardDescription className="text-lg text-muted-foreground max-w-xl mx-auto">
                Connect with our team of verified and experienced real estate agents.
            </CardDescription>
        </CardHeader>
      </Card>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {renderSkeletons(8)}
        </div>
      ) : error ? (
        <Card className="border-destructive bg-destructive/10 text-center py-10">
          <CardHeader>
            <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
            <CardTitle className="text-destructive">Error Loading Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive-foreground">{error}</p>
            <Button onClick={fetchAgents} variant="destructive" className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : agents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed rounded-lg bg-card">
          <Frown className="w-20 h-20 mx-auto text-muted-foreground mb-6" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">No Agents Found</h2>
          <p className="text-muted-foreground">
            There are no agents listed at the moment. Please check back later.
          </p>
        </div>
      )}
    </div>
  );
}
