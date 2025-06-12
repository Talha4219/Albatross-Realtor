
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, PlusCircle, Mail, Phone } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock data for demonstration
const mockAdminAgents = [
  { id: 'agent1', name: 'Alice Wonderland', email: 'alice@example.com', phone: '555-0101', listings: 15, status: 'Active', imageUrl: 'https://placehold.co/40x40.png' },
  { id: 'agent2', name: 'Bob The Builder', email: 'bob@example.com', phone: '555-0102', listings: 8, status: 'Pending Verification', imageUrl: 'https://placehold.co/40x40.png' },
  { id: 'agent3', name: 'Carol Danvers', email: 'carol@example.com', phone: '555-0103', listings: 22, status: 'Active', imageUrl: 'https://placehold.co/40x40.png' },
];

export default function AdminAgentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Agents</h1>
          <p className="text-muted-foreground">Oversee agent profiles, listings, and verification status.</p>
        </div>
        <Button asChild>
          <Link href="/admin/agents/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Agent
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Agent Roster</CardTitle>
          <CardDescription>Showing {mockAdminAgents.length} agents. Search and filter options will be here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Contact</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Listings</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {mockAdminAgents.map((agent) => (
                  <tr key={agent.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={agent.imageUrl} alt={agent.name} data-ai-hint="person avatar"/>
                          <AvatarFallback>{agent.name.substring(0,1)}</AvatarFallback>
                        </Avatar>
                        {agent.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      <div className="flex items-center gap-1"><Mail className="w-3 h-3"/> {agent.email}</div>
                      <div className="flex items-center gap-1"><Phone className="w-3 h-3"/> {agent.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{agent.listings}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        agent.status === 'Active' ? 'bg-green-100 text-green-800' :
                        agent.status === 'Pending Verification' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800' // For 'Suspended' or other statuses
                      }`}>
                        {agent.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="outline" size="sm">Edit</Button>
                      {agent.status === 'Pending Verification' && <Button size="sm">Verify</Button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
           {mockAdminAgents.length === 0 && (
             <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium text-foreground">No agents found</h3>
                <p className="mt-1 text-sm text-muted-foreground">Get started by adding a new agent.</p>
            </div>
          )}
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground text-center pt-4">
        This is a placeholder page. Full agent management features (CRUD, verification, commission tracking) would be here.
      </p>
    </div>
  );
}
