
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit3 } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Post a Property Listing | Albatross Realtor',
  description: 'List your property with Albatross Realtor and reach thousands of potential buyers and renters.',
};

export default function PostListingPage() {
  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-200px)] flex flex-col items-center justify-center">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit mb-4">
            <Edit3 className="w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-headline">Post a Property Listing</CardTitle>
          <CardDescription className="text-lg">
            List your property with Albatross Realtor and reach thousands of potential buyers/renters.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6">
            This page will guide users (especially agents) through the process of submitting a new property listing. It will likely redirect to or integrate the property submission form.
            If you're looking to submit a property now, please navigate to <Link href="/properties/new" className="text-primary underline">Add New Property</Link>.
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
