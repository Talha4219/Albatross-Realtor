
"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Building, PlusCircle, AlertTriangle, Loader2, Check, X, Hourglass, RotateCcw, User } from 'lucide-react';
import type { Property as PropertyType } from '@/types'; 
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


export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, isLoading: isAuthLoading, user: adminUser } = useAuth();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const filterByUserId = searchParams.get('userId');
  const [filterUserName, setFilterUserName] = useState<string | null>(null);


  const [propertyToDelete, setPropertyToDelete] = useState<PropertyType | null>(null);


  const fetchProperties = async () => {
    setIsLoading(true);
    setError(null);
    setFilterUserName(null);

    let apiUrl = '/api/properties';
    if (filterByUserId) {
      apiUrl += `?submittedById=${filterByUserId}`;
    }

    try {
      const res = await fetch(apiUrl, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        let errorMessage = `Error: ${res.status} ${res.statusText}`;
        try {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await res.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
          } else {
            const textError = await res.text();
             if (textError.toLowerCase().includes("<!doctype html>")) {
                errorMessage = "Server returned an HTML error page. This might be due to a server misconfiguration or an error during server-side rendering. Check server logs. Often this is due to a missing MONGODB_URI environment variable.";
             } else {
                errorMessage = textError || errorMessage;
             }
          }
        } catch (e) {
          // Failed to parse error response
        }
         if (errorMessage.includes("MONGODB_URI environment variable")) {
           throw new Error("MONGODB_URI environment variable is not set. Please configure it in your .env file and restart the server.");
        }
        throw new Error(errorMessage);
      }
      const data = await res.json();
      if (data.success) {
        const fetchedProperties = data.data.map((prop: any) => ({
          ...prop,
          postedDate: new Date(prop.postedDate).toISOString(),
          agent: prop.agent ? {
            id: prop.agent.id || 'N/A',
            name: prop.agent.name || 'N/A',
            email: prop.agent.email || 'N/A',
            phone: prop.agent.phone || 'N/A',
            imageUrl: prop.agent.imageUrl,
            isVerified: prop.agent.isVerified,
            specialty: prop.agent.specialty,
            rating: prop.agent.rating,
          } : undefined,
          submittedBy: prop.submittedBy ? { // Assuming submittedBy is populated as UserProfile
            id: prop.submittedBy.id || prop.submittedBy._id || 'N/A', // handle both direct ID or populated object
            name: prop.submittedBy.name || 'N/A',
            email: prop.submittedBy.email || 'N/A',
            role: prop.submittedBy.role || 'user', // Add role if available
          } : undefined,
        }));
        setProperties(fetchedProperties);
        if (filterByUserId && fetchedProperties.length > 0 && fetchedProperties[0].submittedBy) {
          setFilterUserName(fetchedProperties[0].submittedBy.name);
        }

      } else {
        throw new Error(data.error || 'API returned success:false but no error message');
      }
    } catch (err) {
      console.error("Failed to fetch properties:", err);
      const specificError = err instanceof Error ? err.message : 'An unknown error occurred while fetching properties.';
      setError(specificError);
       if (specificError.includes("MONGODB_URI environment variable")) {
         toast({ title: "Database Error", description: specificError, variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) { 
        fetchProperties();
    } else if (isAuthLoading === false && !token) { 
        setError("Authentication token not found. Please log in.");
        setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, isAuthLoading, filterByUserId]); // Add filterByUserId to dependencies

  const handleUpdateStatus = async (propertyId: string, newStatus: 'Approved' | 'Rejected' | 'Pending') => {
    if (!token) {
      toast({ title: "Authentication Error", description: "You must be logged in as an admin.", variant: "destructive" });
      return;
    }
    const propertyToUpdate = properties.find(p => p.id === propertyId);
    if (!propertyToUpdate) {
        toast({ title: "Error", description: "Property not found locally.", variant: "destructive"});
        return;
    }

    try {
      const response = await fetch(`/api/properties/${propertyId}/update-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ approvalStatus: newStatus }),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        toast({ title: `Property ${newStatus}`, description: `Property ID ${propertyId} has been ${newStatus.toLowerCase()}.`, variant: "default" });
        setProperties(prev => 
          prev.map(p => p.id === propertyId ? { ...p, approvalStatus: newStatus, status: result.data.status } : p)
        );
      } else {
        throw new Error(result.error || `Failed to update property status to ${newStatus}`);
      }
    } catch (err) {
      console.error(`Error updating property ${propertyId} to ${newStatus}:`, err);
      toast({ title: "Update Failed", description: (err instanceof Error ? err.message : "An unknown error occurred"), variant: "destructive"});
    }
  };


  const getApprovalStatusBadgeVariant = (status?: 'Pending' | 'Approved' | 'Rejected') => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Pending': return 'secondary';
      case 'Rejected': return 'destructive';
      default: return 'outline';
    }
  };

 const renderErrorContent = () => {
    if (!error) return null;
    if (error.includes("MONGODB_URI environment variable")) {
      return (
        <>
          <p className="text-destructive-foreground font-semibold">Database Configuration Error</p>
          <p className="text-destructive-foreground mt-2">The application cannot connect to the database because the <code>MONGODB_URI</code> environment variable is not set.</p>
          <pre className="mt-2 p-2 bg-destructive/20 text-destructive-foreground rounded text-sm">MONGODB_URI=your_mongodb_connection_string_here</pre>
          <p className="text-destructive-foreground mt-2">After adding the <code>.env</code> file, please restart your development server.</p>
        </>
      );
    }
    return <p className="text-destructive-foreground break-all">{error}</p>;
  };
  
  const handleDeleteProperty = async () => {
    if (!propertyToDelete || !token) {
      toast({ title: "Error", description: "No property selected or not authenticated.", variant: "destructive" });
      setPropertyToDelete(null);
      return;
    }

    try {
      const response = await fetch(`/api/properties/${propertyToDelete.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const result = await response.json();
      if (response.ok && result.success) {
        toast({ title: "Property Deleted", description: `Property "${propertyToDelete.address}" has been deleted.`, variant: "default" });
        setProperties(prev => prev.filter(p => p.id !== propertyToDelete.id));
      } else {
        throw new Error(result.error || "Failed to delete property.");
      }
    } catch (err) {
      console.error(`Error deleting property ${propertyToDelete.id}:`, err);
      toast({ title: "Delete Failed", description: (err instanceof Error ? err.message : "An unknown error occurred"), variant: "destructive"});
    } finally {
      setPropertyToDelete(null);
    }
  };


  return (
    <div className="space-y-6">
      <AlertDialog open={!!propertyToDelete} onOpenChange={(open) => !open && setPropertyToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this property?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete the property "{propertyToDelete?.address}".</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPropertyToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProperty} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Properties</h1>
          <p className="text-muted-foreground">
            {filterByUserId && filterUserName 
              ? `Showing properties submitted by ${filterUserName}.` 
              : `View, edit, approve, and manage all property listings.`}
          </p>
        </div>
        <Button asChild>
          <Link href="/properties/new"><PlusCircle className="mr-2 h-4 w-4" /> Add New Property</Link>
        </Button>
      </div>

      {filterByUserId && (
        <Button variant="outline" asChild>
          <Link href="/admin/properties"><RotateCcw className="mr-2 h-4 w-4" /> Show All Properties</Link>
        </Button>
      )}

      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardHeader><CardTitle className="font-headline text-destructive flex items-center gap-2"><AlertTriangle className="w-6 h-6" />Error Loading Properties</CardTitle></CardHeader>
          <CardContent>{renderErrorContent()}<Button onClick={fetchProperties} variant="outline" className="mt-4 border-destructive text-destructive-foreground hover:bg-destructive/30">Try Again</Button></CardContent>
        </Card>
      )}

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Property Listings</CardTitle>
          <CardDescription>{isLoading ? 'Loading properties...' : `Showing ${properties.length} properties.`}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>
          ) : !error && properties.length === 0 ? (
            <div className="text-center py-12">
              <Building className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">No properties found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {filterByUserId ? "This user has not submitted any properties." : "Get started by adding a new property, or check your database and filters."}
              </p>
            </div>
          ) : !error ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Address</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Submitted By</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Listing Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Approval Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-border">
                  {properties.map((prop) => (
                    <tr key={prop.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{prop.address}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">${prop.price.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {prop.submittedBy ? (
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3"/>
                            {prop.submittedBy.name} ({prop.submittedBy.email})
                          </div>
                        ) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Badge variant={ prop.status === 'For Sale' ? 'default' : prop.status === 'For Rent' ? 'secondary' : prop.status === 'Sold' ? 'destructive' : prop.status === 'Pending Approval' || prop.status === 'Draft' ? 'outline' : 'outline'}>
                          {prop.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Badge variant={getApprovalStatusBadgeVariant(prop.approvalStatus)}>
                            {prop.approvalStatus === 'Pending' && <Hourglass className="w-3 h-3 mr-1" />}
                            {prop.approvalStatus === 'Approved' && <Check className="w-3 h-3 mr-1" />}
                            {prop.approvalStatus === 'Rejected' && <X className="w-3 h-3 mr-1" />}
                            {prop.approvalStatus || 'N/A'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1">
                        <Button variant="outline" size="sm" asChild><Link href={`/properties/edit/${prop.id}`}>Edit</Link></Button>
                        {prop.approvalStatus === 'Pending' && (
                          <>
                            <Button variant="success" size="sm" onClick={() => handleUpdateStatus(prop.id, 'Approved')}><Check className="w-4 h-4 mr-1" /> Approve</Button>
                            <Button variant="destructive" size="sm" onClick={() => handleUpdateStatus(prop.id, 'Rejected')}><X className="w-4 h-4 mr-1" /> Reject</Button>
                          </>
                        )}
                        {(prop.approvalStatus === 'Approved' || prop.approvalStatus === 'Rejected') && (
                             <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(prop.id, 'Pending')}><RotateCcw className="w-4 h-4 mr-1" /> Mark as Pending</Button>
                        )}
                         <Button variant="destructive" size="sm" onClick={() => setPropertyToDelete(prop)}>Delete</Button>
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
        Property management with approval workflow. Search, filtering, and pagination can be added.
      </p>
    </div>
  );
}
