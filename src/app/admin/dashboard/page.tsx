
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
  CheckSquare,
  BarChart3,
  DollarSign,
  ListChecks,
  PlusCircle,
  BookText,
} from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Albatross Realtor',
  description: 'Overview of the platform, statistics, and recent activities.',
};

const summaryStats = [
  {
    title: 'Total Properties',
    value: '1,250',
    icon: Building,
    change: '+5% this month',
    color: 'text-blue-500',
  },
  {
    title: 'Pending Approvals',
    value: '12',
    icon: CheckSquare,
    change: 'Action required',
    color: 'text-orange-500',
  },
  {
    title: 'Total Users',
    value: '5,600',
    icon: Users,
    change: '+150 new users',
    color: 'text-purple-500',
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, Admin! Here's an overview of your platform.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {summaryStats.map((stat) => (
          <Card
            key={stat.title}
            className="shadow-sm hover:shadow-md transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
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
        <Card className="lg:col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-primary" />
              Platform Analytics (Placeholder)
            </CardTitle>
            <CardDescription>
              Overview of user activity and listing performance.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center bg-muted/30 rounded-b-lg">
            <p className="text-muted-foreground italic">
              [Interactive charts for user engagement, property views, etc.
              will be displayed here]
            </p>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <ListChecks className="w-6 h-6 text-primary" />
                Recent Activities & Quick Actions
              </CardTitle>
              <CardDescription>Latest updates and common tasks.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                <div>
                  <p className="font-medium">New Property Submitted</p>
                  <p className="text-xs text-muted-foreground">
                    123 Oak Lane, Pleasantville
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Review
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                <div>
                  <p className="font-medium">New User Registration</p>
                  <p className="text-xs text-muted-foreground">
                    new.user@example.com
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  View User
                </Button>
              </div>
              <Button className="w-full mt-2" asChild>
                <Link href="/properties/new">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add New Property
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Blog Management Card */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <BookText className="w-6 h-6 text-primary" />
                Blog Management
              </CardTitle>
              <CardDescription>
                Create and manage your blog posts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Engage your audience with articles, guides, and market news.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button className="w-full sm:w-auto" asChild>
                    <Link href="/blog/new">
                      <PlusCircle className="mr-2 h-4 w-4" /> Create New Post
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full sm:w-auto" asChild>
                    <Link href="/admin/blog">
                      <ListChecks className="mr-2 h-4 w-4" /> Manage All Posts
                    </Link>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground pt-2">
                  [Blog Stats: 0 Total Posts | 0 Published - Placeholder]
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
