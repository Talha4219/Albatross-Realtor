
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { UserCircle, ShieldCheck, Loader2, AlertTriangle, Users as UsersIcon, Edit3, Eye } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { UserProfile, UserRole } from '@/types'; 
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ADMIN_SUPER_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@albatrossrealtor.com';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, user: adminUser, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();

  const fetchUsers = async () => {
    if (!token) {
      setError("Admin authentication token not found.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: `Error: ${res.status} ${res.statusText}` }));
        throw new Error(errorData.error || 'Failed to fetch users');
      }
      const data = await res.json();
      if (data.success) {
        // Ensure role is part of the UserProfile type fetched
        const fetchedUsers = data.data.map((u: any) => ({
            ...u,
            role: u.role || 'user' // Default if role isn't present, though API should send it
        }));
        setUsers(fetchedUsers);
      } else {
        throw new Error(data.error || 'API returned success:false but no error message');
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
      const specificError = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(specificError);
      toast({ title: "Error Fetching Users", description: specificError, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    } else if (!isAuthLoading && !token) {
      setError("Admin authentication required.");
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, isAuthLoading]);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    if (!token) {
      toast({ title: "Authentication Error", description: "Admin token missing.", variant: "destructive" });
      return;
    }
    
    const originalUsers = [...users];
    // Optimistic UI update
    setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, role: newRole } : u));

    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        toast({ title: "Role Updated", description: `User role updated to ${newRole}.`, variant: "default" });
        // Confirm update with server data (though likely same as optimistic)
        setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, role: result.data.role } : u));
      } else {
        // Revert optimistic update on failure
        setUsers(originalUsers);
        throw new Error(result.error || `Failed to update role to ${newRole}`);
      }
    } catch (err) {
      // Revert optimistic update on error
      setUsers(originalUsers);
      console.error(`Error updating user ${userId} role to ${newRole}:`, err);
      toast({ title: "Update Failed", description: (err instanceof Error ? err.message : "An unknown error occurred"), variant: "destructive" });
    }
  };


  const getUserStatus = (/* user: UserProfile */) => {
    // Placeholder logic, can be expanded if user status field is added to User model
    return 'Active'; 
  };

  if (isAuthLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading authentication...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
          <p className="text-muted-foreground">Administer user accounts, roles, and permissions.</p>
        </div>
      </div>

      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardHeader><CardTitle className="font-headline text-destructive flex items-center gap-2"><AlertTriangle className="w-6 h-6" />Error Loading Users</CardTitle></CardHeader>
          <CardContent>
            <p className="text-destructive-foreground break-all">{error}</p>
            <Button onClick={fetchUsers} variant="outline" className="mt-4 border-destructive text-destructive-foreground hover:bg-destructive/30" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>User Accounts</CardTitle>
          <CardDescription>{isLoading ? 'Loading users...' : `Showing ${users.length} users.`}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && !error ? (
            <div className="flex justify-center items-center py-12"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>
          ) : !error && users.length === 0 && !isLoading ? (
            <div className="text-center py-12">
              <UsersIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">No users found</h3>
              <p className="mt-1 text-sm text-muted-foreground">User registrations will appear here.</p>
            </div>
          ) : !error && users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Joined</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-border">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8"><AvatarImage src="https://placehold.co/40x40.png" alt={user.name} data-ai-hint="person avatar" /><AvatarFallback>{user.name.substring(0, 1)}</AvatarFallback></Avatar>
                          {user.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {user.email === ADMIN_SUPER_EMAIL ? (
                           <div className="flex items-center gap-1.5">
                            <ShieldCheck className="h-4 w-4 text-primary" />
                            <span className="text-xs font-medium text-primary">Admin (Super)</span>
                           </div>
                        ) : (
                          <Select
                            value={user.role}
                            onValueChange={(newRole) => handleRoleChange(user.id, newRole as UserRole)}
                          >
                            <SelectTrigger className="w-[120px] h-8 text-xs">
                              <SelectValue placeholder="Set role" />
                            </SelectTrigger>
                            <SelectContent>
                              {(['user', 'agent', 'admin'] as UserRole[]).map(roleOption => (
                                <SelectItem key={roleOption} value={roleOption} className="text-xs capitalize">
                                  {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {user.createdAt ? format(new Date(user.createdAt), 'yyyy-MM-dd') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getUserStatus(/* user */) === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {getUserStatus(/* user */)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/properties?userId=${user.id}`}>
                            <Eye className="mr-1 h-3.5 w-3.5" /> View Properties
                          </Link>
                        </Button>
                        {/* More actions like 'Suspend' can be added here */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground text-center pt-4">
        User management with role assignment.
      </p>
    </div>
  );
}


      