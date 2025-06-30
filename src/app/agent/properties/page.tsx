
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Building, PlusCircle, Edit, Trash2, Loader2, AlertTriangle, Eye, RotateCcw } from 'lucide-react';
import type { Property } from '@/types';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from 'date-fns';

export default function AgentPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const searchParams = useSearchParams();
  const filterByPropertyType = searchParams.get('type');

  const fetchProperties = useCallback(async () => {
    if (!token) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filterByPropertyType) {
        params.set('type', filterByPropertyType);
      }
      const res = await fetch(`/api/my-properties?${params.toString()}`, {
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
        setError(err.message);
        toast({ title: "Error Fetching Properties", description: err.message, variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  }, [token, toast, filterByPropertyType]);
  
  useEffect(() => {
    if (!isAuthLoading && token) {
        fetchProperties();
    }
  }, [token, isAuthLoading, fetchProperties]);

  const handleDeleteProperty = async () => {
    if (!propertyToDelete || !token) return;

    try {
      const response = await fetch(`/api/properties/${propertyToDelete.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const result = await response.json();
      if (response.ok && result.success) {
        toast({ title: "Property Deleted", description: `Property "${propertyToDelete.address}" has been deleted.` });
        setProperties(prev => prev.filter(p => p.id !== propertyToDelete.id));
      } else {
        throw new Error(result.error || "Failed to delete property.");
      }
    } catch (err) {
      toast({ title: "Delete Failed", description: (err instanceof Error ? err.message : "An unknown error occurred"), variant: "destructive"});
    } finally {
      setPropertyToDelete(null);
    }
  };
  
  const getStatusBadgeVariant = (status: 'Pending' | 'Approved' | 'Rejected' | undefined) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Pending': return 'secondary';
      case 'Rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const pageTitle = filterByPropertyType === 'Plot' ? 'My Plot Listings' : 'My Property Listings';
  const pageDescription = filterByPropertyType === 'Plot' ? 'Manage, edit, and view the status of your plots.' : 'Manage, edit, and view the status of your properties.';
  const addLink = filterByPropertyType === 'Plot' ? "/add-listing?type=Plot" : "/add-listing?type=Property";

  return (
    <div className="space-y-6">
      <AlertDialog open={!!propertyToDelete} onOpenChange={(open) => !open && setPropertyToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your property listing for "{propertyToDelete?.address}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPropertyToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProperty} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{pageTitle}</h1>
          <p className="text-muted-foreground">{pageDescription}</p>
        </div>
        <Button asChild>
          <Link href={addLink}>
            <PlusCircle className="mr-2 h-4 w-4" /> {filterByPropertyType === 'Plot' ? 'Add New Plot' : 'Add New Property'}
          </Link>
        </Button>
      </div>

      {filterByPropertyType && (
        <Button variant="outline" asChild>
          <Link href="/agent/properties"><RotateCcw className="mr-2 h-4 w-4" /> Show All Listings</Link>
        </Button>
      )}

      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardHeader><CardTitle className="font-headline text-destructive flex items-center gap-2"><AlertTriangle />Error Loading</CardTitle></CardHeader>
          <CardContent><p className="text-destructive-foreground">{error}</p></CardContent>
        </Card>
      )}

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>All My Listings</CardTitle>
          <CardDescription>{isLoading ? 'Loading...' : `Showing ${properties.length} listings.`}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>
          ) : properties.length === 0 && !error ? (
            <div className="text-center py-12">
              <Building className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium">No {filterByPropertyType ? `${filterByPropertyType.toLowerCase()}s` : 'properties'} found</h3>
              <p className="mt-1 text-sm text-muted-foreground">Get started by adding a new {filterByPropertyType ? filterByPropertyType.toLowerCase() : 'property'}.</p>
            </div>
          ) : (
             <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Address</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Approval Status</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date Submitted</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-border">
                  {properties.map((prop) => (
                    <tr key={prop.id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-foreground">{prop.address}</td>
                       <td className="px-4 py-4 whitespace-nowrap text-sm text-muted-foreground">
                         <Badge variant={prop.status === 'For Sale' ? 'default' : prop.status === 'For Rent' ? 'secondary' : 'outline'}>{prop.status}</Badge>
                       </td>
                       <td className="px-4 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          <Badge variant={getStatusBadgeVariant(prop.approvalStatus)}>
                            {prop.approvalStatus}
                          </Badge>
                       </td>
                       <td className="px-4 py-4 whitespace-nowrap text-sm text-muted-foreground">
                         {prop.createdAt ? format(new Date(prop.createdAt), 'yyyy-MM-dd') : 'N/A'}
                       </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-1">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/property/${prop.id}`} target="_blank"><Eye className="mr-1 h-3.5 w-3.5"/>View</Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/properties/edit/${prop.id}`}><Edit className="mr-1 h-3.5 w-3.5"/>Edit</Link>
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => setPropertyToDelete(prop)}>
                          <Trash2 className="mr-1 h-3.5 w-3.5"/>Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
