
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Users, CheckSquare, BarChart3, DollarSign, ListChecks, PlusCircle } from 'lucide-react'; // Added PlusCircle
import Link from 'next/link';

const summaryStats = [
  { title: 'Total Properties', value: '1,250', icon: Building, change: '+5% this month', color: 'text-blue-500' },
  { title: 'Active Agents', value: '78', icon: Users, change: '+2 new agents', color: 'text-green-500' },
  { title: 'Pending Approvals', value: '12', icon: CheckSquare, change: 'Action required', color: 'text-orange-500' },
  { title: 'Total Users', value: '5,600', icon: Users, change: '+150 new users', color: 'text-purple-500' },
];

export default function AdminDashboardPage() {
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
        <Card className="lg:col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-primary" />
              Platform Analytics (Placeholder)
            </CardTitle>
            <CardDescription>Overview of user activity and listing performance.</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center bg-muted/30 rounded-b-lg">
            <p className="text-muted-foreground italic">
              [Interactive charts for user engagement, property views, etc. will be displayed here]
            </p>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <ListChecks className="w-6 h-6 text-primary" />
              Recent Activities & Quick Actions
            </CardTitle>
            <CardDescription>Latest updates and common tasks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
              <div>
                <p className="font-medium">New Property Submitted</p>
                <p className="text-xs text-muted-foreground">123 Oak Lane, Pleasantville</p>
              </div>
              <Button variant="outline" size="sm">Review</Button>
            </div>
             <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
              <div>
                <p className="font-medium">Agent Registration</p>
                <p className="text-xs text-muted-foreground">agent.new@example.com</p>
              </div>
              <Button variant="outline" size="sm">Approve</Button>
            </div>
             <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
              <div>
                <p className="font-medium">Reported Listing</p>
                <p className="text-xs text-muted-foreground">ID: prop_xyz789</p>
              </div>
              <Button variant="destructive" size="sm">Investigate</Button>
            </div>
            <Button className="w-full mt-2" asChild>
              <Link href="/properties/new"> {/* Updated link */}
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Property
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
