
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Sparkles, PlusCircle, Edit, Trash2, Eye, AlertTriangle, Loader2 } from 'lucide-react';
import type { Project as DevelopmentType } from '@/types';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
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

export default function AdminDevelopmentsPage() {
  const [developments, setDevelopments] = useState<DevelopmentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, isLoading: isAuthLoading, logout } = useAuth();
  const { toast } = useToast();
  const [developmentToDelete, setDevelopmentToDelete] = useState<DevelopmentType | null>(null);
  
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get('status');

  const getPageTitle = () => {
    if (statusFilter === 'Trending') return 'Trending Projects';
    if (statusFilter === 'Upcoming') return 'Upcoming Projects';
    return 'All Projects';
  };

  const getPageDescription = () => {
    if (statusFilter === 'Trending') return 'Manage the most popular new developments.';
    if (statusFilter === 'Upcoming') return 'Oversee projects that are launching soon.';
    return 'Oversee and add new real estate projects and developments.';
  }

  const fetchDevelopments = useCallback(async () => {
    if (!token && !isAuthLoading) {
        logout();
        return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const url = statusFilter ? `/api/admin/developments?status=${statusFilter}` : '/api/admin/developments';
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!res.ok) {
        let errorDetailMessage = `Request failed: ${res.status} ${res.statusText}`;
        try {
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const errorData = await res.json();
                errorDetailMessage = errorData.error || errorData.message || errorDetailMessage;
            } else {
                const textError = await res.text();
                if (textError.toLowerCase().includes("<!doctype html>")) {
                   errorDetailMessage = "Server returned an HTML error page. This may be due to a server misconfiguration (e.g., missing MONGODB_URI) or an error during server-side rendering. Check server logs.";
                } else {
                   errorDetailMessage = textError || errorDetailMessage;
                }
            }
        } catch (e) {
            // Failed to parse error response body
        }
        
        if (res.status === 401 || res.status === 403 || errorDetailMessage.includes("Authorization header missing") || errorDetailMessage.includes("token invalid/expired")) {
          logout();
          return;
        }
        throw new Error(errorDetailMessage);
      }

      const data = await res.json();
      if (data.success) {
        setDevelopments(data.data);
      } else {
        throw new Error(data.error || 'API returned success:false but no error message');
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error("Failed to fetch developments:", err);
        let userFriendlyMessage = err.message;
        if (err instanceof TypeError && err.message.toLowerCase().includes('failed to fetch')) {
          userFriendlyMessage = 'Could not connect to the server. Please check your network connection and ensure the server is running correctly. This may be due to a missing server configuration (e.g., MONGODB_URI).';
        }
        setError(userFriendlyMessage);
        if (!(userFriendlyMessage.includes("Authorization header missing") || userFriendlyMessage.includes("token invalid/expired"))) {
             toast({ title: "Error Fetching Developments", description: userFriendlyMessage, variant: "destructive" });
        }
      } else {
        console.error("An unexpected error type occurred while fetching developments:", err);
        setError('An unknown error occurred.');
        toast({ title: "Error Fetching Developments", description: 'An unknown error occurred.', variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  }, [token, logout, toast, isAuthLoading, statusFilter]);
  
  useEffect(() => {
    if (!isAuthLoading && token) {
        fetchDevelopments();
    } else if (!isAuthLoading && !token) {
        logout();
    }
  }, [token, isAuthLoading, logout, fetchDevelopments, statusFilter]);

  const handleDeleteDevelopment = async () => {
    if (!developmentToDelete || !token) {
      toast({ title: "Error", description: "No development selected or not authenticated.", variant: "destructive" });
      setDevelopmentToDelete(null);
      return;
    }

    try {
      const response = await fetch(`/api/admin/developments/${developmentToDelete.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const result = await response.json();
      if (response.ok && result.success) {
        toast({ title: "Development Deleted", description: `Development "${developmentToDelete.name}" has been deleted.`, variant: "default" });
        setDevelopments(prev => prev.filter(dev => dev.id !== developmentToDelete.id));
      } else {
        if (response.status === 401 || response.status === 403) {
            logout();
            return;
        }
        throw new Error(result.error || "Failed to delete development.");
      }
    } catch (err) {
      console.error(`Error deleting development ${developmentToDelete.id}:`, err);
      toast({ title: "Delete Failed", description: (err instanceof Error ? err.message : "An unknown error occurred"), variant: "destructive"});
    } finally {
      setDevelopmentToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <AlertDialog open={!!developmentToDelete} onOpenChange={(open) => !open && setDevelopmentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the development "{developmentToDelete?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDevelopmentToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDevelopment} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{getPageTitle()}</h1>
          <p className="text-muted-foreground">{getPageDescription()}</p>
        </div>
        <Button asChild>
          <Link href="/admin/developments/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Project
          </Link>
        </Button>
      </div>

      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardHeader><CardTitle className="font-headline text-destructive flex items-center gap-2"><AlertTriangle className="w-6 h-6" />Error Loading Projects</CardTitle></CardHeader>
          <CardContent>
            <p className="text-destructive-foreground break-all">{error}</p>
            <Button onClick={fetchDevelopments} variant="outline" className="mt-4 border-destructive text-destructive-foreground hover:bg-destructive/30" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Project Listings</CardTitle>
          <CardDescription>{isLoading ? 'Loading projects...' : `Showing ${developments.length} projects.`}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && !error ? (
            <div className="flex justify-center items-center py-12"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>
          ) : !error && developments.length === 0 && !isLoading ? (
            <div className="text-center py-12">
              <Sparkles className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">No projects found</h3>
              <p className="mt-1 text-sm text-muted-foreground">Get started by adding a new project or adjust your filters.</p>
            </div>
          ) : !error && developments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {developments.map((dev) => (
                <Card key={dev.id} className="overflow-hidden flex flex-col">
                  <Image 
                    src={dev.imageUrl || 'https://placehold.co/400x225.png'} 
                    alt={dev.name} 
                    width={400} 
                    height={225} 
                    className="w-full h-48 object-cover"
                    data-ai-hint={dev.dataAiHint || "building construction site"}
                  />
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold">{dev.name}</CardTitle>
                    <CardDescription className="text-xs">{dev.location} - By {dev.developer}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground flex-grow">
                    <p className="line-clamp-2">{dev.description || 'No description available.'}</p>
                    {dev.status && <Badge variant="secondary" className="mt-2">{dev.status}</Badge>}
                  </CardContent>
                  <CardFooter className="border-t p-3 space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={dev.learnMoreLink || `/new-projects#${dev.id}`} target="_blank"><Eye className="mr-1 h-3.5 w-3.5" /> View</Link>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" disabled> {/* Edit to be implemented later */}
                      <Edit className="mr-1 h-3.5 w-3.5" /> Edit (Soon)
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => setDevelopmentToDelete(dev)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
       <p className="text-xs text-muted-foreground text-center pt-4">
        Edit functionality for projects will be added later.
      </p>
    </div>
  );
}
