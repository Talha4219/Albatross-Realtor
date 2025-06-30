
"use client";

import { Suspense } from 'react';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { Loader2 } from 'lucide-react';

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="flex h-64 w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}
