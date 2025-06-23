import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

export default function BlogPostNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4">
      <FileQuestion className="w-24 h-24 text-destructive mb-6" />
      <h1 className="text-4xl font-headline font-bold mb-4">Blog Post Not Found</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Sorry, we couldn&apos;t find the blog post you were looking for. The link might be incorrect or the post may have been removed.
      </p>
      <div className="flex space-x-4">
        <Button asChild size="lg" className="font-headline">
          <Link href="/">Go to Homepage</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="font-headline">
          <Link href="/blog">Explore All Posts</Link>
        </Button>
      </div>
    </div>
  );
}
