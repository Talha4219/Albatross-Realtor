
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, ListChecks, PlusCircle, BarChart3, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Property } from '@/types';
import AgentAnalyticsChart from '@/components/agent/AgentAnalyticsChart';

export default function AgentDashboardPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [totalViews, setTotalViews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { token, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProperties = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const res = await fetch('/api/my-properties', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch properties: ${res.statusText}`);
        }

        const data = await res.json();
        if (data.success) {
          setProperties(data.data);
          const calculatedViews = data.data.reduce((acc: number, p: Property) => {
              return acc + (p.views || 0);
          }, 0);
          setTotalViews(calculatedViews);

        } else {
          throw new Error(data.error || 'API call failed to fetch properties');
        }
      } catch (err) {
        if (err instanceof Error) {
            toast({ title: "Error Fetching Stats", description: err.message, variant: "destructive" });
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    if (!isAuthLoading) {
      fetchProperties();
    }
  }, [token, isAuthLoading, toast]);
  
  const propertiesThisMonth = properties.filter(p => {
    if (!p.createdAt) return false;
    const propertyDate = new Date(p.createdAt);
    const now = new Date();
    return propertyDate.getMonth() === now.getMonth() && propertyDate.getFullYear() === now.getFullYear();
  }).length;


  const summaryStats = [
    {
      title: 'Total Properties Listed',
      value: isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : String(properties.length),
      icon: Building,
      change: `+${propertiesThisMonth} this month`,
      color: 'text-blue-500',
    },
    {
      title: 'Total Views',
      value: isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : totalViews.toLocaleString(),
      icon: BarChart3,
      change: 'Across all listings', 
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agent Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your listings.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {summaryStats.map((stat) => (
          <Card key={stat.title} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color} opacity-80`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
         <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <PlusCircle className="w-6 h-6 text-primary" />
                Quick Actions
              </CardTitle>
              <CardDescription>Your most common tasks, just a click away.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4">
               <Button className="w-full" asChild>
                  <Link href="/add-listing">
                    <Building className="mr-2 h-4 w-4" /> Add New Listing
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/agent/properties">
                    <ListChecks className="mr-2 h-4 w-4" /> Manage My Listings
                  </Link>
                </Button>
            </CardContent>
          </Card>
          <AgentAnalyticsChart data={properties} />
      </div>
    </div>
  );
}
