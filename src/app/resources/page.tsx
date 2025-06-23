
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Library } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Real Estate Resources Hub | Albatross Realtor',
  description: 'Your one-stop destination for our blog, market trends, guides, and financial calculators.',
};

export default function ResourcesPage() {
  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-200px)] flex flex-col items-center justify-center">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit mb-4">
            <Library className="w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-headline">Resources Hub</CardTitle>
          <CardDescription className="text-lg">
            Your one-stop destination for real estate knowledge and tools.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6">
            This page will serve as a central hub for all our resources, including links to our blog, market trends analysis, buyer/seller guides, legal tips, and financial calculators.
          </p>
          <div className="space-y-3 mb-6">
            <Button variant="link" asChild><Link href="/blog">Explore Blog</Link></Button><br/>
            <Button variant="link" asChild><Link href="/market-trends">View Market Trends</Link></Button><br/>
            <Button variant="link" asChild><Link href="/guides">Read Our Guides</Link></Button><br/>
            <Button variant="link" asChild><Link href="/financing/calculator">Use Loan Calculator</Link></Button>
          </div>
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
