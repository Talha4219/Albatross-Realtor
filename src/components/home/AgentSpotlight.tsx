
"use client";

import React from 'react';
import AgentCard from '@/components/agents/AgentCard'; // Ensure this path is correct
import { Button } from '@/components/ui/button';
import type { Agent } from '@/types';
import Link from 'next/link';
import { mockAgents } from '@/lib/mock-data';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Users, MessageSquare, Edit3 } from 'lucide-react';

const FEATURED_AGENTS_COUNT = 4; // Number of agents to showcase

export default function AgentSpotlight() {
  // In a real app, you might fetch these or have a specific "featured" flag
  const showcasedAgents: Agent[] = mockAgents.slice(0, FEATURED_AGENTS_COUNT);

  if (showcasedAgents.length === 0) {
    return null; // Don't render the section if there are no agents
  }

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary text-center mb-2">
          Meet Our Top Agents
        </h2>
        <p className="text-lg text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
          Connect with verified agents to find your perfect property or sell with confidence.
        </p>

        <Carousel
          opts={{
            align: "start",
            loop: showcasedAgents.length > 3, // Loop if more than 3 items on desktop
          }}
          className="w-full max-w-xs sm:max-w-xl md:max-w-4xl lg:max-w-6xl mx-auto"
        >
          <CarouselContent className="-ml-4">
            {showcasedAgents.map((agent) => (
              <CarouselItem key={agent.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="p-1 h-full">
                  <AgentCard agent={agent} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {showcasedAgents.length > 1 && ( 
            <>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </>
          )}
        </Carousel>
        
        <div className="mt-10 text-center">
          <p className="font-semibold text-accent">All Agents Verified for Experience and Credentials</p>
          <p className="text-sm text-muted-foreground italic mt-1">
            [Agent Metrics: 500+ Verified Agents | 10K+ Clients Served - Placeholder]
          </p>
        </div>

        <div className="mt-10 text-center space-y-4">
          <Button size="lg" variant="default" asChild className="font-headline">
            <Link href="/agents/find">Find More Agents</Link>
          </Button>
          <div className="text-sm text-muted-foreground space-x-2 sm:space-x-4">
            <Link href="/post-listing" className="hover:text-primary hover:underline inline-flex items-center gap-1">
              <Edit3 className="w-4 h-4" /> Post a Listing
            </Link>
            <span className="text-muted-foreground/50">|</span>
            <Link href="/agents/tools" className="hover:text-primary hover:underline inline-flex items-center gap-1">
              <Users className="w-4 h-4" /> Explore Agent Tools
            </Link>
          </div>
          <p className="text-xs text-muted-foreground italic">
            <MessageSquare className="w-3.5 h-3.5 inline-block mr-1" />
            Need help choosing an agent? Ask our AI! (Bottom Right) &rarr;
          </p>
        </div>
      </div>
    </section>
  );
}
