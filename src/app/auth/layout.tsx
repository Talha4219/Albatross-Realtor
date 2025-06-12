
import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-muted/40 py-12">
      {children}
    </div>
  );
}
