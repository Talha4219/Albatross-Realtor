
"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { BlogPost } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Tag, CalendarDays, User } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface BlogPostCardProps {
  post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group h-full">
      <Card className="overflow-hidden h-full flex flex-col hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="p-0 relative">
          <Image
            src={post.imageUrl}
            alt={`Image for blog post: ${post.title}`}
            width={400}
            height={225} 
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={post.dataAiHint || "blog article relevant image"}
          />
          <Badge className="absolute top-2 left-2" variant="secondary">{post.category}</Badge>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-xl font-semibold text-primary group-hover:text-primary/80 transition-colors mb-2 line-clamp-2">
            {post.title}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground line-clamp-3 mb-3">
            {post.excerpt}
          </CardDescription>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {post.date && (
              <span className="flex items-center gap-1">
                <CalendarDays className="w-3.5 h-3.5" />
                {format(parseISO(post.date), 'MMM d, yyyy')}
              </span>
            )}
            {post.author && (
               <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {post.author}
              </span>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 border-t mt-auto">
          <Button variant="outline" size="sm" className="w-full font-medium text-primary border-primary hover:bg-primary/10 hover:text-primary">
            Read More <ExternalLink className="w-3.5 h-3.5 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
