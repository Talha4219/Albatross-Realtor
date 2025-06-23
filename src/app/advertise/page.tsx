
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Megaphone } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Advertise With Us | Albatross Realtor',
  description: 'Showcase your properties or services to a targeted real estate audience.',
};

export default function AdvertisePage() {
  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-200px)] flex flex-col items-center justify-center">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit mb-4">
            <Megaphone className="w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-headline">Advertise With Us</CardTitle>
          <CardDescription className="text-lg">
            Showcase your properties or services to a targeted real estate audience.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6">
            Information about advertising packages, featured listings, and promotional opportunities on Albatross Realtor will be available here.
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
