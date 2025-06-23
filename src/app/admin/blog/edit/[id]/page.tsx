
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import BlogPostForm, { type BlogPostFormData } from '@/components/blog/BlogPostForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Edit, Loader2, AlertTriangle } from 'lucide-react';
import type { BlogPost } from '@/types';

export default function EditBlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { token, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && token) {
      const fetchPost = async () => {
        setIsLoadingData(true);
        setError(null);
        try {
          const res = await fetch(`/api/admin/blog/posts/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (!res.ok) throw new Error(`Failed to fetch post: ${res.statusText}`);
          const result = await res.json();
          if (result.success) {
            setPost(result.data);
          } else {
            throw new Error(result.error || 'Failed to load post data.');
          }
        } catch (err) {
          console.error("Error fetching post:", err);
          setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
          setIsLoadingData(false);
        }
      };
      fetchPost();
    }
  }, [id, token]);

  const handleUpdatePost = async (data: BlogPostFormData) => {
    if (!token || !id) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/blog/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        toast({
          title: "Post Updated",
          description: `Post "${result.data.title}" has been updated successfully.`,
        });
        router.push('/admin/blog');
      } else {
        throw new Error(result.error || "Failed to update post.");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      toast({
        title: "Update Failed",
        description: (error instanceof Error ? error.message : "An unknown error occurred."),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitialFormData = (postData: BlogPost): Partial<BlogPostFormData> => {
    return {
      ...postData,
      tags: postData.tags?.join(', '), // Convert array to comma-separated string for the form
    };
  };
  
  if (isAuthLoading || isLoadingData) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="border-destructive bg-destructive/10">
          <CardHeader><CardTitle className="font-headline text-destructive flex items-center gap-2"><AlertTriangle />Error Loading Post</CardTitle></CardHeader>
          <CardContent><p className="text-destructive-foreground">{error}</p></CardContent>
        </Card>
      </div>
    );
  }

  if (!post) {
    return <div className="text-center py-8">Post not found.</div>;
  }
  
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/blog">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Blog Post</h1>
          <p className="text-muted-foreground">Modify the details of your article.</p>
        </div>
      </div>
      
      <Card className="shadow-sm">
         <CardHeader>
          <CardTitle className="flex items-center gap-2"><Edit className="w-5 h-5 text-primary"/> Edit Content</CardTitle>
          <CardDescription>Make changes to your post below.</CardDescription>
        </CardHeader>
        <CardContent>
          <BlogPostForm 
            onSubmit={handleUpdatePost} 
            isLoading={isSubmitting} 
            formType="edit"
            initialData={getInitialFormData(post)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
