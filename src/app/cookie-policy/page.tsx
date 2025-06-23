
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Cookie } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | Albatross Realtor',
  description: 'Learn how Albatross Realtor uses cookies to enhance your website experience.',
};

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-200px)] flex flex-col items-center justify-center">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit mb-4">
            <Cookie className="w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-headline">Cookie Policy</CardTitle>
          <CardDescription className="text-lg">
            Information about how we use cookies on our website.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center prose dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-6">
            This page will explain what cookies are, how Albatross Realtor uses them, the types of cookies we use, and how you can manage your cookie preferences.
          </p>
           <p className="text-sm">Last Updated: [Date]</p>
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
