"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DeprecatedAdminAgentsPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/dashboard');
  }, [router]);
  return <div>This page has been removed. Redirecting...</div>;
}
