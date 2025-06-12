
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-200px)] flex flex-col items-center justify-center">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit mb-4">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-headline">Privacy Policy</CardTitle>
          <CardDescription className="text-lg">
            How we collect, use, and protect your personal information.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center prose dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-6">
            Detailed information about our privacy practices will be outlined here. This includes data collection, usage, cookies, third-party sharing, user rights, and data security measures.
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
