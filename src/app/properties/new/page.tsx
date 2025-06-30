
"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function DeprecatedNewPropertyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const type = searchParams.get('type') || 'Property';
    router.replace(`/add-listing?type=${type}`);
  }, [router, searchParams]);

  return (
    <div className="flex justify-center items-center h-screen">
       <Loader2 className="h-8 w-8 animate-spin text-primary" />
       <p className="ml-4 text-muted-foreground">Redirecting to the new listing page...</p>
    </div>
  );
}
