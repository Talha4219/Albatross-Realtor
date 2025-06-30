"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page is deprecated and now redirects to the new /agents page.
export default function DeprecatedFindAgentPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/agents');
  }, [router]);
  return <div>Redirecting to the agents page...</div>;
}
