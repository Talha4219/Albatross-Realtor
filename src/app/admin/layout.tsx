
"use client";

import type { ReactNode } from 'react';
import { useEffect }
from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isLoading: isAuthLoading } = useAuth(); // Use user object
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading) {
      if (!user || user.role !== 'admin') {
        router.replace('/auth/login?redirect=/admin/dashboard'); // Redirect to login if not admin
      }
    }
  }, [user, isAuthLoading, router]);

  if (isAuthLoading || !user || user.role !== 'admin') {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-muted/40">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Verifying admin access...</p>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-screen bg-muted/40">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-6 animate-in fade-in-25 duration-300">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
