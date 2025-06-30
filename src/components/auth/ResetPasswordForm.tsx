
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form';

const resetPasswordSchema = z.object({
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setApiError("No password reset token found. The link may be invalid.");
    }
  }, [token]);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit: SubmitHandler<ResetPasswordFormData> = async (data) => {
    if (!token) return;
    setIsLoading(true);
    setApiError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: data.password }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccessMessage(result.message);
        form.reset();
      } else {
        throw new Error(result.error || "An unexpected error occurred.");
      }
    } catch (error) {
      setApiError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">Reset Your Password</CardTitle>
        <CardDescription>Enter your new password below.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {apiError && (
              <div className="bg-destructive/10 border border-destructive/50 text-destructive p-3 rounded-md flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4" />
                <p>{apiError}</p>
              </div>
            )}
            {successMessage && (
              <div className="bg-success/10 border border-success/50 text-success-foreground p-3 rounded-md flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-success" />
                <p>{successMessage}</p>
              </div>
            )}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} disabled={!!successMessage || !token} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} disabled={!!successMessage || !token} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full font-headline" disabled={isLoading || !!successMessage || !token}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Reset Password
            </Button>
            {successMessage && (
              <Button variant="link" size="sm" asChild className="p-0 text-muted-foreground">
                <Link href="/auth/login">Proceed to Log In</Link>
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
