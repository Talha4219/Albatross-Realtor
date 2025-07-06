
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, ListChecks, PlusCircle, CheckCircle, Clock, Loader2, Home } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Property } from '@/types';
import AgentAnalyticsChart from '@/components/agent/AgentAnalyticsChart';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export default function AgentDashboardPage() {
  const [properties, setProperties] = useState<Property[]>([]);
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
    
    if (!isAuthLoading && token) {
      fetchProperties();
    }
  }, [token, isAuthLoading, toast]);
  
  const stats = useMemo(() => {
    return {
      total: properties.length,
      approved: properties.filter(p => p.approvalStatus === 'Approved').length,
      pending: properties.filter(p => p.approvalStatus === 'Pending').length,
      totalViews: properties.reduce((acc, p) => acc + (p.views || 0), 0),
    }
  }, [properties]);


  const summaryStats = [
    { title: 'Total Listings', value: stats.total, icon: Building, color: 'text-blue-500' },
    { title: 'Approved Listings', value: stats.approved, icon: CheckCircle, color: 'text-green-500' },
    { title: 'Pending Approval', value: stats.pending, icon: Clock, color: 'text-orange-500' },
    { title: 'Total Views', value: stats.totalViews.toLocaleString(), icon: Home, color: 'text-purple-500' },
  ];
  
  const getStatusBadgeVariant = (status?: 'Pending' | 'Approved' | 'Rejected') => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Pending': return 'secondary';
      case 'Rejected': return 'destructive';
      default: return 'outline';
    }
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agent Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your listings and performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryStats.map((stat) => (
          <Card key={stat.title} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color} opacity-80`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
       <div className="grid gap-6 md:grid-cols-5">
         <div className="md:col-span-3">
             <Card className="shadow-sm">
                <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <ListChecks className="w-6 h-6 text-primary" />
                    Recent Listings Status
                </CardTitle>
                <CardDescription>An overview of your 5 most recent submissions.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                         <div className="flex justify-center items-center py-4"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                    ) : properties.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">You haven't listed any properties yet.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left font-medium text-muted-foreground p-2">Property</th>
                              <th className="text-left font-medium text-muted-foreground p-2">Submitted</th>
                              <th className="text-left font-medium text-muted-foreground p-2">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {properties.slice(0, 5).map(prop => (
                              <tr key={prop.id} className="border-b last:border-0">
                                <td className="p-2 font-medium truncate max-w-[150px]">{prop.address}</td>
                                <td className="p-2 text-muted-foreground">{formatDistanceToNow(new Date(prop.createdAt!), { addSuffix: true })}</td>
                                <td className="p-2"><Badge variant={getStatusBadgeVariant(prop.approvalStatus)}>{prop.approvalStatus}</Badge></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                </CardContent>
             </Card>
         </div>
         <div className="md:col-span-2 space-y-6">
            <Card className="shadow-sm">
                <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <PlusCircle className="w-6 h-6 text-primary" />
                    Quick Actions
                </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                <Button className="w-full" asChild>
                    <Link href="/add-listing">
                        <Building className="mr-2 h-4 w-4" /> Add New Listing
                    </Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                    <Link href="/agent/properties">
                        <ListChecks className="mr-2 h-4 w-4" /> Manage All Listings
                    </Link>
                    </Button>
                </CardContent>
            </Card>
            <AgentAnalyticsChart data={properties} />
         </div>
      </div>
    </div>
  );
}
