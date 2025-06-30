
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Building,
  Users,
  BarChart3,
  ListChecks,
  PlusCircle,
  BookText,
  Loader2,
  UserPlus,
  Home,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Property, UserProfile, BlogPost } from '@/types';
import AdminAnalyticsChart from '@/components/admin/AdminAnalyticsChart';
import { format } from 'date-fns';

type ChartData = { month: string; users: number; properties: number; };

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    propertiesThisMonth: 0,
    totalAgents: 0,
    agentsThisMonth: 0,
    totalUsers: 0,
    usersThisMonth: 0,
    totalPosts: 0,
    publishedPosts: 0,
    totalViews: 0,
    viewsThisWeek: 0,
  });
  const [recentUsers, setRecentUsers] = useState<UserProfile[]>([]);
  const [recentProperties, setRecentProperties] = useState<Property[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token, isLoading: isAuthLoading, logout } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const responses = await Promise.all([
          fetch('/api/properties', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/admin/blog/posts', { headers: { 'Authorization': `Bearer ${token}` } }),
        ]);

        for (const res of responses) {
            if (res.status === 401 || res.status === 403) {
                toast({ title: "Session Expired", description: "Your session has expired. Please log in again.", variant: "destructive" });
                logout();
                return;
            }
        }

        const [propertiesRes, usersRes, blogRes] = responses;

        if (!propertiesRes.ok || !usersRes.ok || !blogRes.ok) {
            throw new Error('Failed to fetch all required statistics data.');
        }
        
        const propertiesData = await propertiesRes.json();
        const usersData = await usersRes.json();
        const blogData = await blogRes.json();

        if (propertiesData.success && usersData.success && blogData.success) {
          const properties: Property[] = propertiesData.data;
          const users: UserProfile[] = usersData.data;
          const posts: BlogPost[] = blogData.data;
          
          const now = new Date();
          const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          
          const propertiesThisMonth = properties.filter(p => p.createdAt && new Date(p.createdAt).getMonth() === now.getMonth() && new Date(p.createdAt).getFullYear() === now.getFullYear()).length;
          const usersThisMonth = users.filter(u => u.createdAt && new Date(u.createdAt).getMonth() === now.getMonth() && new Date(u.createdAt).getFullYear() === now.getFullYear()).length;
          const agents = users.filter(u => u.role === 'agent');
          const agentsThisMonth = agents.filter(a => a.createdAt && new Date(a.createdAt).getMonth() === now.getMonth() && new Date(a.createdAt).getFullYear() === now.getFullYear()).length;
          const totalViews = properties.reduce((acc, p) => acc + (p.views || 0), 0);
          const viewsThisWeek = properties.filter(p => p.createdAt && new Date(p.createdAt) >= oneWeekAgo).reduce((acc, p) => acc + (p.views || 0), 0);
          
          setRecentUsers(users.slice(0, 2));
          setRecentProperties(properties.slice(0, 2));

          // Process data for chart
          const monthlyData: { [key: string]: { users: number; properties: number } } = {};
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
          sixMonthsAgo.setDate(1);

          for (let i = 0; i < 6; i++) {
              const month = format(new Date(sixMonthsAgo.getFullYear(), sixMonthsAgo.getMonth() + i), 'yyyy-MM');
              monthlyData[month] = { users: 0, properties: 0 };
          }
          
          users.forEach(user => {
            if (user.createdAt && new Date(user.createdAt) >= sixMonthsAgo) {
              const month = format(new Date(user.createdAt), 'yyyy-MM');
              if (monthlyData[month]) monthlyData[month].users++;
            }
          });

          properties.forEach(prop => {
            if (prop.createdAt && new Date(prop.createdAt) >= sixMonthsAgo) {
              const month = format(new Date(prop.createdAt), 'yyyy-MM');
              if (monthlyData[month]) monthlyData[month].properties++;
            }
          });
          
          const processedChartData = Object.keys(monthlyData).map(monthKey => ({
              month: format(new Date(monthKey + '-02'), 'MMM yyyy'), // Use day 2 to avoid timezone issues
              users: monthlyData[monthKey].users,
              properties: monthlyData[monthKey].properties,
          }));

          setChartData(processedChartData);

          setStats({
            totalProperties: properties.length,
            propertiesThisMonth: propertiesThisMonth,
            totalAgents: agents.length,
            agentsThisMonth: agentsThisMonth,
            totalUsers: users.length,
            usersThisMonth: usersThisMonth,
            totalPosts: posts.length,
            publishedPosts: posts.filter(p => p.status === 'published').length,
            totalViews: totalViews,
            viewsThisWeek: viewsThisWeek,
          });
        } else {
          throw new Error('API returned errors for one or more stat queries.');
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
      fetchStats();
    }
  }, [token, isAuthLoading, toast, logout]);
  
  const summaryStats = [
    { title: 'Total Properties', value: isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.totalProperties.toLocaleString(), icon: Building, change: `+${stats.propertiesThisMonth} this month`, color: 'text-blue-500' },
    { title: 'Total Agents', value: isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.totalAgents, icon: Users, change: `+${stats.agentsThisMonth} this month`, color: 'text-green-500' },
    { title: 'Total Users', value: isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.totalUsers.toLocaleString(), icon: Users, change: `+${stats.usersThisMonth} new users`, color: 'text-purple-500' },
    { title: 'Total Property Views', value: isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.totalViews.toLocaleString(), icon: BarChart3, change: `+${stats.viewsThisWeek.toLocaleString()} this week`, color: 'text-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Admin! Here's an overview of your platform.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <AdminAnalyticsChart data={chartData} />

        <div className="lg:col-span-3 space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <ListChecks className="w-6 h-6 text-primary" />
                Recent Activities
              </CardTitle>
              <CardDescription>Latest user sign-ups and property listings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                <div className="flex justify-center items-center py-4"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              ) : (
                <>
                  {recentUsers.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                      <div>
                        <p className="font-medium flex items-center gap-1.5"><UserPlus className="w-4 h-4 text-green-500" />New User Registration</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{user.email}</p>
                      </div>
                      <Button variant="outline" size="sm" asChild><Link href={`/admin/users?search=${user.email}`}>View</Link></Button>
                    </div>
                  ))}
                  {recentProperties.map(prop => (
                    <div key={prop.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                      <div>
                        <p className="font-medium flex items-center gap-1.5"><Home className="w-4 h-4 text-blue-500" />New Property Submitted</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{prop.address}</p>
                      </div>
                      <Button variant="outline" size="sm" asChild><Link href={`/admin/properties`}>Review</Link></Button>
                    </div>
                  ))}
                  {recentUsers.length === 0 && recentProperties.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No recent activities.</p>
                  )}
                </>
              )}
               <Button className="w-full mt-2" asChild>
                <Link href="/add-listing">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add New Listing
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <BookText className="w-6 h-6 text-primary" />
                Blog Management
              </CardTitle>
              <CardDescription>Create and manage your blog posts.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Engage your audience with articles, guides, and market news.</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button className="w-full sm:w-auto" asChild><Link href="/blog/new"><PlusCircle className="mr-2 h-4 w-4" /> Create New Post</Link></Button>
                  <Button variant="outline" className="w-full sm:w-auto" asChild><Link href="/admin/blog"><ListChecks className="mr-2 h-4 w-4" /> Manage All Posts</Link></Button>
                </div>
                <p className="text-xs text-muted-foreground pt-2">
                  {isLoading ? 'Loading stats...' : `[Blog Stats: ${stats.totalPosts} Total Posts | ${stats.publishedPosts} Published]`}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
