
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import BlogPostForm, { type BlogPostFormData } from '@/components/blog/BlogPostForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, BookPlus, Loader2 } from 'lucide-react';

export default function NewBlogPostPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { user, token, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Redirect if not logged in after auth state is determined
    if (!isAuthLoading && !user) {
      router.replace('/auth/login?redirect=/blog/new');
    }
  }, [user, isAuthLoading, router]);

  const handleCreatePost = async (data: BlogPostFormData) => {
    if (!token) {
      toast({ title: "Authentication Error", description: "You must be logged in to create a post.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/blog/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        toast({
          title: "Blog Post Submitted",
          description: `Your post "${result.data.title}" has been submitted for approval.`,
        });
        // Redirect to main blog page or a user's "my posts" page
        router.push('/blog');
      } else {
        throw new Error(result.error || "Failed to create post.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Creation Failed",
        description: (error instanceof Error ? error.message : "An unknown error occurred."),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading || !user) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Verifying access...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/blog">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Blog</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Blog Post</h1>
          <p className="text-muted-foreground">Fill out the details for your new article.</p>
        </div>
      </div>
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BookPlus className="w-5 h-5 text-primary"/> Post Content</CardTitle>
          <CardDescription>Fields marked with * are required. Your post will be reviewed by an admin before publishing.</CardDescription>
        </CardHeader>
        <CardContent>
          <BlogPostForm 
            onSubmit={handleCreatePost} 
            isLoading={isSubmitting} 
            formType="create"
            // Pre-fill author name from logged-in user context
            initialData={{ author: user.name }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
