
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { TrendingUp, AreaChart, DollarSign, Users, BarChartHorizontalBig, ExternalLink, MessageSquare } from 'lucide-react';

interface TrendSummary {
  id: string;
  icon: React.ElementType;
  title: string;
  dataPoint: string;
  description: string;
  link: string;
}

const mockTrendSummaries: TrendSummary[] = [
  {
    id: 'price-trends',
    icon: TrendingUp,
    title: 'Price Trends in Pleasantville',
    dataPoint: '+7.5% YoY',
    description: 'Median home prices are steadily increasing.',
    link: '/market-trends#price-pleasantville',
  },
  {
    id: 'demand-commercial',
    icon: AreaChart,
    title: 'Commercial Space Demand',
    dataPoint: '+12% Inquiries',
    description: 'Growing interest in office and retail spaces.',
    link: '/market-trends#demand-commercial',
  },
  {
    id: 'rental-yield',
    icon: DollarSign,
    title: 'Average Rental Yield',
    dataPoint: '5.8%',
    description: 'Solid returns for rental property investors.',
    link: '/market-trends#rental-yield',
  },
   {
    id: 'new-developments',
    icon: Users,
    title: 'New Development Hotspots',
    dataPoint: '3 Major Projects',
    description: 'Suburbia Greens seeing rapid development.',
    link: '/market-trends#developments-suburbia',
  },
];

export default function MarketTrendsShowcase() {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary text-center mb-2">
          Stay Ahead with Market Trends
        </h2>
        <p className="text-lg text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
          Get the latest data on property prices, demand, and investment opportunities to make informed decisions.
        </p>

        {/* Interactive Chart Placeholder */}
        <Card className="mb-10 shadow-md">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2">
              <BarChartHorizontalBig className="w-6 h-6 text-primary" />
              Overall Market Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64 md:h-80 flex items-center justify-center bg-muted/30 rounded-b-lg">
            <p className="text-muted-foreground italic">
              [Interactive Market Trend Chart Coming Soon - e.g., Price Index vs. Time]
            </p>
          </CardContent>
        </Card>

        {/* Trend Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {mockTrendSummaries.map((trend) => (
            <Card key={trend.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-primary">{trend.title}</CardTitle>
                <trend.icon className="h-5 w-5 text-accent" />
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="text-2xl font-bold">{trend.dataPoint}</div>
                <p className="text-xs text-muted-foreground mt-1">{trend.description}</p>
              </CardContent>
              <CardContent className="pt-0">
                 <Button variant="outline" size="sm" asChild className="w-full text-primary border-primary hover:bg-primary/10 hover:text-primary">
                  <Link href={trend.link}>See Details <ExternalLink className="w-3.5 h-3.5 ml-2" /></Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Trust Elements Placeholder */}
        <div className="text-center text-sm text-muted-foreground italic mb-8">
          <p>[Data Sourced from Verified Listings and Industry Reports - Placeholder]</p>
          <p>[Trusted by 10K+ Investors - Placeholder]</p>
        </div>

        {/* Secondary CTA & AI Chat Prompt Placeholder */}
        <div className="text-center space-y-4">
          <Button size="lg" variant="default" asChild className="font-headline">
            <Link href="/market-trends">Explore All Market Trends</Link>
          </Button>
          <div className="text-sm text-muted-foreground space-x-4">
            <Link href="/agents" className="hover:text-primary hover:underline">Find an Agent for Expert Advice</Link>
            <span className="text-muted-foreground/50">|</span>
            <Link href="/financing/calculator" className="hover:text-primary hover:underline">Use Our Loan Calculator</Link>
          </div>
          <p className="text-xs text-muted-foreground italic">
            <MessageSquare className="w-3.5 h-3.5 inline-block mr-1" />
            Want personalized market insights? Ask our AI! (Bottom Right) &rarr;
          </p>
        </div>
      </div>
    </section>
  );
}
