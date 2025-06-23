
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookHeart } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Story | Albatross Realtor',
  description: 'Learn about the history, mission, and values that drive Albatross Realtor.',
};

export default function OurStoryPage() {
  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-200px)] flex flex-col items-center justify-center">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit mb-4">
            <BookHeart className="w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-headline">Our Story</CardTitle>
          <CardDescription className="text-lg">
            The journey of Albatross Realtor and our mission.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center prose dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-6">
            Learn about the history of Albatross Realtor, our values, our commitment to clients, and our vision for the future of real estate.
          </p>
          <Button asChild size="lg" className="mt-6">
            <Link href="/" className="flex items-center">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Homepage
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
