"use client";

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { BlogPost } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarDays, User, Tag, ArrowLeft } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const fetchPost = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/blog/posts/${slug}`);
          if (!res.ok) {
            if (res.status === 404) {
              notFound();
            }
            throw new Error(`Failed to fetch post: ${res.statusText}`);
          }
          const data = await res.json();
          if (data.success) {
            setPost(data.data);
          } else {
            notFound();
          }
        } catch (error) {
          console.error("Error fetching blog post:", error);
          // Could redirect to a generic error page or show an error message
          notFound();
        } finally {
          setIsLoading(false);
        }
      };
      fetchPost();
    }
  }, [slug]);

  if (isLoading) {
    return <SkeletonBlogPostPage />;
  }

  if (!post) {
    notFound();
    return null;
  }

  return (
    <article className="max-w-4xl mx-auto py-8">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="p-0">
          <Image
            src={post.imageUrl}
            alt={post.title}
            width={1200}
            height={630}
            className="w-full aspect-video object-cover"
            priority
            data-ai-hint={post.dataAiHint || "blog article hero image"}
          />
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <Badge variant="secondary" className="mb-4">{post.category}</Badge>
          <CardTitle className="text-3xl md:text-4xl font-headline font-bold text-primary mb-4">
            {post.title}
          </CardTitle>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-6">
            {post.author && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
            )}
            {post.createdAt && (
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                <time dateTime={post.createdAt}>{format(parseISO(post.createdAt), 'MMMM d, yyyy')}</time>
              </div>
            )}
          </div>
          <div className="prose dark:prose-invert max-w-none text-lg" dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
           {post.tags && post.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-1.5"><Tag className="w-4 h-4" />TAGS</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </article>
  );
}


const SkeletonBlogPostPage = () => (
    <div className="max-w-4xl mx-auto py-8 animate-pulse">
        <div className="mb-6">
            <Skeleton className="h-10 w-36" />
        </div>
        <Card className="overflow-hidden shadow-lg">
            <Skeleton className="w-full aspect-video" />
            <CardContent className="p-6 md:p-8">
                <Skeleton className="h-6 w-24 mb-4" />
                <Skeleton className="h-10 w-full mb-2" />
                <Skeleton className="h-10 w-3/4 mb-4" />
                <div className="flex gap-6 mb-6">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-40" />
                </div>
                <div className="space-y-3">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-5/6" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-1/2" />
                </div>
            </CardContent>
        </Card>
    </div>
);
