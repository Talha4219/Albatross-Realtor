
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Building,
  Users,
  ListChecks,
  PlusCircle,
  BookText,
  Loader2,
  Home,
  Clock,
  Check,
  X,
  UserCircle,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Property, UserProfile, BlogPost } from '@/types';
import AdminAnalyticsChart from '@/components/admin/AdminAnalyticsChart';
import { format, formatDistanceToNow } from 'date-fns';

type ChartData = { month: string; users: number; properties: number; };

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalUsers: 0,
    totalPosts: 0,
    pendingProperties: 0,
    pendingPosts: 0,
  });
  const [recentUsers, setRecentUsers] = useState<UserProfile[]>([]);
  const [pendingProperties, setPendingProperties] = useState<Property[]>([]);
  const [pendingPosts, setPendingPosts] = useState<BlogPost[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token, isLoading: isAuthLoading, logout } = useAuth();
  const { toast } = useToast();

  const fetchDashboardData = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const [propertiesRes, usersRes, blogRes] = await Promise.all([
        fetch('/api/properties', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/admin/blog/posts', { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);

      for (const res of [propertiesRes, usersRes, blogRes]) {
        if (res.status === 401 || res.status === 403) {
          toast({ title: "Session Expired", description: "Your session has expired. Please log in again.", variant: "destructive" });
          logout();
          return;
        }
        if (!res.ok) throw new Error('Failed to fetch dashboard data.');
      }
      
      const propertiesData = await propertiesRes.json();
      const usersData = await usersRes.json();
      const blogData = await blogRes.json();
      
      const allProperties: Property[] = propertiesData.success ? propertiesData.data : [];
      const allUsers: UserProfile[] = usersData.success ? usersData.data : [];
      const allPosts: BlogPost[] = blogData.success ? blogData.data : [];

      const pendingProps = allProperties.filter(p => p.approvalStatus === 'Pending');
      const pendingBlogPosts = allPosts.filter(p => p.approvalStatus === 'Pending');
      
      setPendingProperties(pendingProps.slice(0, 5));
      setPendingPosts(pendingBlogPosts.slice(0, 5));
      setRecentUsers(allUsers.slice(0, 5));

      setStats({
        totalProperties: allProperties.length,
        totalUsers: allUsers.length,
        totalPosts: allPosts.length,
        pendingProperties: pendingProps.length,
        pendingPosts: pendingBlogPosts.length,
      });

      // Process data for chart
      const monthlyData: { [key: string]: { users: number; properties: number } } = {};
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
      sixMonthsAgo.setDate(1);

      for (let i = 0; i < 6; i++) {
        const month = format(new Date(sixMonthsAgo.getFullYear(), sixMonthsAgo.getMonth() + i), 'yyyy-MM');
        monthlyData[month] = { users: 0, properties: 0 };
      }
      
      allUsers.forEach(user => {
        if (user.createdAt && new Date(user.createdAt) >= sixMonthsAgo) {
          const month = format(new Date(user.createdAt), 'yyyy-MM');
          if (monthlyData[month]) monthlyData[month].users++;
        }
      });

      allProperties.forEach(prop => {
        if (prop.createdAt && new Date(prop.createdAt) >= sixMonthsAgo) {
          const month = format(new Date(prop.createdAt), 'yyyy-MM');
          if (monthlyData[month]) monthlyData[month].properties++;
        }
      });
      
      const processedChartData = Object.keys(monthlyData).map(monthKey => ({
        month: format(new Date(monthKey + '-02'), 'MMM yy'),
        users: monthlyData[monthKey].users,
        properties: monthlyData[monthKey].properties,
      }));
      setChartData(processedChartData);

    } catch (err) {
      if (err instanceof Error) {
        toast({ title: "Error Fetching Stats", description: err.message, variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  }, [token, toast, logout]);
  
  useEffect(() => {
    if (!isAuthLoading && token) {
      fetchDashboardData();
    }
  }, [token, isAuthLoading, fetchDashboardData]);

  const handleApproval = async (type: 'property' | 'post', id: string, approvalStatus: 'Approved' | 'Rejected') => {
      const endpoint = type === 'property' ? `/api/properties/${id}/update-status` : `/api/admin/blog/posts/${id}`;
      try {
        const res = await fetch(endpoint, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ approvalStatus }),
        });
        if (!res.ok) throw new Error(`Failed to update ${type} status`);
        
        toast({ title: "Success", description: `${type.charAt(0).toUpperCase() + type.slice(1)} status updated.` });
        
        // Refresh data to reflect the change
        fetchDashboardData();
      } catch (error) {
        toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
      }
  };
  
  const summaryStats = [
    { title: 'Total Properties', value: stats.totalProperties, icon: Building, color: 'text-blue-500' },
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-green-500' },
    { title: 'Pending Properties', value: stats.pendingProperties, icon: Clock, color: 'text-orange-500' },
    { title: 'Pending Posts', value: stats.pendingPosts, icon: BookText, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">An overview of platform activity and content requiring action.</p>
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4 space-y-6">
           <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <ListChecks className="w-6 h-6 text-primary" />
                Action Required: Pending Approvals
              </CardTitle>
              <CardDescription>Review and approve new content submissions.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                  <div className="flex justify-center items-center py-4"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              ) : (pendingProperties.length === 0 && pendingPosts.length === 0) ? (
                 <p className="text-sm text-muted-foreground text-center py-4">No pending items.</p>
              ) : (
                <div className="space-y-4">
                  {pendingProperties.map(prop => (
                    <div key={prop.id} className="flex items-center justify-between p-2 bg-secondary/50 rounded-md">
                      <div className="flex items-center gap-3">
                        <Home className="w-4 h-4 text-blue-500"/>
                        <div>
                          <p className="font-medium text-sm truncate max-w-[200px]">{prop.address}</p>
                          <p className="text-xs text-muted-foreground">By: {prop.submittedBy?.name || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        <Button size="icon" variant="outline" className="h-7 w-7" asChild><Link href={`/property/${prop.id}`} target="_blank"><Eye className="w-4 h-4" /></Link></Button>
                        <Button size="icon" variant="success" className="h-7 w-7" onClick={() => handleApproval('property', prop.id, 'Approved')}><Check className="w-4 h-4" /></Button>
                        <Button size="icon" variant="destructive" className="h-7 w-7" onClick={() => handleApproval('property', prop.id, 'Rejected')}><X className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  ))}
                   {pendingPosts.map(post => (
                    <div key={post.id} className="flex items-center justify-between p-2 bg-secondary/50 rounded-md">
                      <div className="flex items-center gap-3">
                        <BookText className="w-4 h-4 text-purple-500"/>
                        <div>
                           <p className="font-medium text-sm truncate max-w-[200px]">{post.title}</p>
                           <p className="text-xs text-muted-foreground">By: {post.submittedBy?.name || 'N/A'}</p>
                        </div>
                      </div>
                       <div className="flex gap-1.5">
                        <Button size="icon" variant="outline" className="h-7 w-7" asChild><Link href={`/blog/${post.slug}`} target="_blank"><Eye className="w-4 h-4" /></Link></Button>
                        <Button size="icon" variant="success" className="h-7 w-7" onClick={() => handleApproval('post', post.id, 'Approved')}><Check className="w-4 h-4" /></Button>
                        <Button size="icon" variant="destructive" className="h-7 w-7" onClick={() => handleApproval('post', post.id, 'Rejected')}><X className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            {(stats.pendingProperties > 5 || stats.pendingPosts > 5) && (
              <CardFooter>
                 <Link href="/admin/properties?approvalStatus=Pending" className="text-xs text-muted-foreground hover:text-primary">View all pending items...</Link>
              </CardFooter>
            )}
          </Card>
           <AdminAnalyticsChart data={chartData} />
        </div>
        
        <div className="lg:col-span-3 space-y-6">
          <Card className="shadow-sm">
             <CardHeader>
               <CardTitle className="font-headline">Quick Actions</CardTitle>
             </CardHeader>
             <CardContent className="grid grid-cols-2 gap-2">
                <Button asChild variant="outline"><Link href="/add-listing"><PlusCircle className="mr-2 h-4 w-4"/>Add Property</Link></Button>
                <Button asChild variant="outline"><Link href="/add-listing?type=Development"><PlusCircle className="mr-2 h-4 w-4"/>Add Project</Link></Button>
                <Button asChild variant="outline"><Link href="/blog/new"><PlusCircle className="mr-2 h-4 w-4"/>New Post</Link></Button>
                <Button asChild variant="outline"><Link href="/admin/users"><Users className="mr-2 h-4 w-4"/>Manage Users</Link></Button>
             </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <UserCircle className="w-6 h-6 text-primary" />
                    Recent User Registrations
                </CardTitle>
            </CardHeader>
            <CardContent>
                 {isLoading ? (
                    <div className="flex justify-center items-center py-4"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                ) : recentUsers.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No recent user registrations.</p>
                ) : (
                    <ul className="space-y-3">
                        {recentUsers.map(user => (
                            <li key={user.id} className="flex justify-between items-center text-sm">
                                <span>{user.name} ({user.email})</span>
                                <span className="text-muted-foreground">{formatDistanceToNow(new Date(user.createdAt!), { addSuffix: true })}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
