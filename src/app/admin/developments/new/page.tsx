
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function DeprecatedNewDevelopmentPage() {
  const router = useRouter();
  useEffect(() => {
    // Redirect to the new, unified listing page for developments
    router.replace('/add-listing?type=Development');
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
       <Loader2 className="h-8 w-8 animate-spin text-primary" />
       <p className="ml-4 text-muted-foreground">Redirecting to the new listing page...</p>
    </div>
  );
}
