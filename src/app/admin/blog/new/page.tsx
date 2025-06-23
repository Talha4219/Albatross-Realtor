
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function OldNewBlogPostPage() {
  const router = useRouter();
  useEffect(() => {
    // Redirect to the new, public page for creating blog posts
    router.replace('/blog/new');
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
       <Loader2 className="h-8 w-8 animate-spin text-primary" />
       <p className="ml-4 text-muted-foreground">Redirecting to the new blog post page...</p>
    </div>
  );
}
