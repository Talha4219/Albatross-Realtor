
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Star } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client Testimonials | Albatross Realtor',
  description: 'See what our satisfied clients have to say about their experience with Albatross Realtor.',
};

export default function TestimonialsPage() {
  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-200px)] flex flex-col items-center justify-center">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit mb-4">
            <Star className="w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-headline">Client Testimonials</CardTitle>
          <CardDescription className="text-lg">
            Read what our satisfied clients and partners have to say.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6">
            This page will feature a collection of testimonials from homebuyers, sellers, renters, and agents who have used Albatross Realtor.
          </p>
          <Button asChild size="lg">
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
