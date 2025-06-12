
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Zap, Users, MessageSquare, ShieldCheck } from 'lucide-react'; // Added ShieldCheck
import Link from 'next/link';

interface Benefit {
  icon: React.ElementType;
  title: string;
  description: string;
}

const benefits: Benefit[] = [
  {
    icon: ShieldCheck, // Changed from CheckCircle for thematic consistency
    title: '100% Verified Listings',
    description: 'Every property and agent is vetted to ensure your peace of mind and secure transactions.',
  },
  {
    icon: Zap,
    title: 'AI-Powered Assistance',
    description: 'Get instant help, property recommendations, and market insights 24/7 with our smart AI chat.',
  },
  {
    icon: Users,
    title: 'Expert Agents & Tools',
    description: 'Connect with top-tier, verified agents and leverage comprehensive tools for buying, selling, or renting.',
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary text-center mb-2">
          Why Choose Albatross Realtor? 
        </h2>
        <p className="text-lg text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
          Discover why thousands trust us for verified listings, expert guidance, and seamless property searches.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {benefits.map((benefit) => (
            <Card key={benefit.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col text-center items-center">
              <CardHeader className="pb-3">
                <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit mb-2">
                  <benefit.icon className="w-8 h-8" />
                </div>
                <CardTitle className="font-headline text-xl text-primary">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Trust Elements Placeholder */}
        <div className="text-center text-sm text-muted-foreground italic mb-8">
          <p>[Trust Statement: Trusted by 100K+ Users | Secure Data - Placeholder]</p>
          <p>[Metrics/Badges: 4.9/5 TrustScore | 500K+ Verified Listings - Placeholder]</p>
        </div>

        {/* Secondary CTA & AI Chat Prompt Placeholder */}
        <div className="text-center space-y-4">
          <Button size="lg" variant="default" asChild className="font-headline">
            <Link href="#property-search-section">Get Started Now</Link>
          </Button>
          <div className="text-sm text-muted-foreground space-x-2 sm:space-x-4">
            <Link href="/resources" className="hover:text-primary hover:underline">Explore Our Tools</Link>
            <span className="text-muted-foreground/50">|</span>
            <Link href="/contact" className="hover:text-primary hover:underline">Contact Support</Link>
          </div>
          <p className="text-xs text-muted-foreground italic">
            <MessageSquare className="w-3.5 h-3.5 inline-block mr-1" />
            Curious about our features? Ask our AI! (Bottom Right) &rarr;
          </p>
        </div>
      </div>
    </section>
  );
}
