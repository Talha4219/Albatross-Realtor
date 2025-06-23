
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BookText, PlusCircle, Edit, Trash2, Loader2, AlertTriangle, Eye, Check, X, Hourglass, User, RotateCcw } from 'lucide-react';
import type { BlogPost } from '@/types';
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

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, user, isLoading: isAuthLoading, logout } = useAuth();
  const { toast } = useToast();
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);

  const fetchPosts = useCallback(async () => {
    if (!token) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/blog/posts', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!res.ok) {
        let errorMsg = `Request failed: ${res.status}`;
        try {
          const errorData = await res.json();
          errorMsg = errorData.error || errorMsg;
        } catch (e) { /* ignore json parse error */ }
        
        if (res.status === 401 || res.status === 403) {
          logout();
          return;
        }
        throw new Error(errorMsg);
      }

      const data = await res.json();
      if (data.success) {
        setPosts(data.data);
      } else {
        throw new Error(data.error || 'API call failed to fetch posts');
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error("Failed to fetch posts:", err);
        setError(err.message);
        toast({ title: "Error Fetching Posts", description: err.message, variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  }, [token, logout, toast]);
  
  useEffect(() => {
    if (!isAuthLoading) {
        if (token && user?.role === 'admin') {
            fetchPosts();
        } else {
            // This is handled by AdminLayout, but as a fallback.
        }
    }
  }, [token, user, isAuthLoading, fetchPosts]);

  const handleDeletePost = async () => {
    if (!postToDelete || !token) return;

    try {
      const response = await fetch(`/api/admin/blog/posts/${postToDelete.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const result = await response.json();
      if (response.ok && result.success) {
        toast({ title: "Post Deleted", description: `Post "${postToDelete.title}" has been deleted.` });
        setPosts(prev => prev.filter(p => p.id !== postToDelete.id));
      } else {
        if (response.status === 401 || response.status === 403) {
            logout();
            return;
        }
        throw new Error(result.error || "Failed to delete post.");
      }
    } catch (err) {
      console.error(`Error deleting post ${postToDelete.id}:`, err);
      toast({ title: "Delete Failed", description: (err instanceof Error ? err.message : "An unknown error occurred"), variant: "destructive"});
    } finally {
      setPostToDelete(null);
    }
  };
  
  const handleUpdateStatus = async (postId: string, newStatus: 'Approved' | 'Rejected' | 'Pending') => {
    if (!token) return;

    try {
      const response = await fetch(`/api/admin/blog/posts/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ approvalStatus: newStatus }),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        toast({
          title: "Status Updated",
          description: `Post status has been updated to ${newStatus}.`,
        });
        setPosts(prev => prev.map(p => p.id === postId ? result.data : p));
      } else {
        throw new Error(result.error || "Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Update Failed",
        description: (error instanceof Error ? error.message : "An unknown error occurred."),
        variant: "destructive",
      });
    }
  };

   const getStatusBadgeVariant = (status: 'published' | 'draft') => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'secondary';
      default: return 'outline';
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

  return (
    <div className="space-y-6">
      <AlertDialog open={!!postToDelete} onOpenChange={(open) => !open && setPostToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog post titled "{postToDelete?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPostToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Blog Posts</h1>
          <p className="text-muted-foreground">Approve, edit, and manage all blog posts and articles.</p>
        </div>
        <Button asChild>
          <Link href="/blog/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Post
          </Link>
        </Button>
      </div>

      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardHeader><CardTitle className="font-headline text-destructive flex items-center gap-2"><AlertTriangle className="w-6 h-6" />Error Loading Posts</CardTitle></CardHeader>
          <CardContent>
            <p className="text-destructive-foreground">{error}</p>
            <Button onClick={fetchPosts} variant="outline" className="mt-4 border-destructive text-destructive-foreground hover:bg-destructive/30" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>All Posts</CardTitle>
          <CardDescription>{isLoading ? 'Loading posts...' : `Showing ${posts.length} posts.`}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && !error ? (
            <div className="flex justify-center items-center py-12"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>
          ) : !error && posts.length === 0 && !isLoading ? (
            <div className="text-center py-12">
              <BookText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">No posts found</h3>
              <p className="mt-1 text-sm text-muted-foreground">Get started by creating a new post.</p>
            </div>
          ) : !error && posts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Submitted By</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Publish Status</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Approval Status</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Created At</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-border">
                  {posts.map((post) => (
                    <tr key={post.id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-foreground">{post.title}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5"/>
                          {post.submittedBy?.name || 'N/A'}
                        </div>
                      </td>
                       <td className="px-4 py-4 whitespace-nowrap text-sm text-muted-foreground">
                         <Badge variant={getStatusBadgeVariant(post.status)}>{post.status}</Badge>
                       </td>
                       <td className="px-4 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          <Badge variant={getApprovalStatusBadgeVariant(post.approvalStatus)}>
                              {post.approvalStatus === 'Pending' && <Hourglass className="w-3 h-3 mr-1" />}
                              {post.approvalStatus === 'Approved' && <Check className="w-3 h-3 mr-1" />}
                              {post.approvalStatus === 'Rejected' && <X className="w-3 h-3 mr-1" />}
                              {post.approvalStatus || 'N/A'}
                          </Badge>
                       </td>
                       <td className="px-4 py-4 whitespace-nowrap text-sm text-muted-foreground">
                         {post.createdAt ? format(new Date(post.createdAt), 'yyyy-MM-dd') : 'N/A'}
                       </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-1">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/blog/${post.slug}`} target="_blank"><Eye className="mr-1 h-3.5 w-3.5"/>View</Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/blog/edit/${post.id}`}><Edit className="mr-1 h-3.5 w-3.5"/>Edit</Link>
                        </Button>
                        
                        {/* Approval Actions */}
                        {post.approvalStatus === 'Pending' && (
                          <>
                            <Button variant="success" size="sm" onClick={() => handleUpdateStatus(post.id, 'Approved')}>
                              <Check className="mr-1 h-3.5 w-3.5"/> Approve
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleUpdateStatus(post.id, 'Rejected')}>
                              <X className="mr-1 h-3.5 w-3.5"/> Reject
                            </Button>
                          </>
                        )}
                        {(post.approvalStatus === 'Approved' || post.approvalStatus === 'Rejected') && (
                          <Button variant="secondary" size="sm" onClick={() => handleUpdateStatus(post.id, 'Pending')}>
                            <RotateCcw className="mr-1 h-3.5 w-3.5"/> Mark as Pending
                          </Button>
                        )}

                        <Button variant="destructive" size="sm" onClick={() => setPostToDelete(post)}>
                          <Trash2 className="mr-1 h-3.5 w-3.5"/>Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
