
"use client";

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AgentSidebar from '@/components/agent/AgentSidebar';
import AgentHeader from '@/components/agent/AgentHeader';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Loader2 } from 'lucide-react';

export default function AgentLayout({ children }: { children: ReactNode }) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading) {
      // Allow admin to view agent dashboard, but redirect anyone else
      if (!user || (user.role !== 'agent' && user.role !== 'admin')) {
        router.replace('/auth/login?redirect=/agent/dashboard');
      }
    }
  }, [user, isAuthLoading, router]);

  if (isAuthLoading || !user || (user.role !== 'agent' && user.role !== 'admin')) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-muted/40">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Verifying agent access...</p>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-screen bg-muted/40">
        <AgentSidebar />
        <div className="flex flex-1 flex-col">
          <AgentHeader />
          <main className="flex-1 overflow-y-auto p-6 animate-in fade-in-25 duration-300">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
