"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DeprecatedAgentProfilePage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/');
  }, [router]);
  return <div>This page has been removed. Redirecting...</div>;
}
