
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit: SubmitHandler<ForgotPasswordFormData> = async (data) => {
    setIsLoading(true);
    setApiError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
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
        <CardTitle className="text-2xl font-headline">Forgot Password</CardTitle>
        <CardDescription>Enter your email to receive a password reset link.</CardDescription>
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input id="email" type="email" placeholder="you@example.com" {...field} required disabled={!!successMessage} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full font-headline" disabled={isLoading || !!successMessage}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Send Reset Link
            </Button>
            <Button variant="link" size="sm" asChild className="p-0 text-muted-foreground">
              <Link href="/auth/login">Back to Log In</Link>
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
