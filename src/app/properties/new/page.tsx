
"use client";

import React, { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// This component contains the hook and is wrapped in Suspense below.
function Redirector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const type = searchParams.get('type') || 'Property';
    router.replace(`/add-listing?type=${type}`);
  }, [router, searchParams]);

  // This component handles logic and doesn't need to render UI.
  return null;
}

export default function DeprecatedNewPropertyPage() {
  return (
    <div className="flex justify-center items-center h-screen">
       <Loader2 className="h-8 w-8 animate-spin text-primary" />
       <p className="ml-4 text-muted-foreground">Redirecting to the new listing page...</p>
       <Suspense fallback={null}>
        <Redirector />
       </Suspense>
    </div>
  );
}
