
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DeprecatedVerifyPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect users away from this page as it's no longer part of the flow
    const timer = setTimeout(() => {
      router.replace('/auth/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Card className="w-full max-w-md shadow-xl text-center">
        <CardHeader>
            <CardTitle>Page No Longer In Use</CardTitle>
            <CardDescription>
                Our signup process has been simplified. Email verification is no longer required.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4 text-muted-foreground">Redirecting to login...</p>
            </div>
        </CardContent>
    </Card>
  );
}
