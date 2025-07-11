
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password cannot be empty." }),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const [apiError, setApiError] = useState<string | null>(null);
  const { login, isLoading, user } = useAuth(); // user from useAuth can be used for conditional rendering
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setApiError(null);
    const loggedInUser = await login(data.email, data.password);
    if (loggedInUser) {
      if (loggedInUser.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (loggedInUser.role === 'agent') {
        router.push('/agent/dashboard');
      } else {
        router.push('/'); // Redirect regular users to homepage
      }
    } else {
      // AuthContext's login function now returns the user or null
      // A more specific error might be available from a global error state in AuthContext if designed that way
      setApiError('Login failed. Please check your email and password.');
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">Log In</CardTitle>
        <CardDescription>Access your Albatross Realtor account or admin dashboard.</CardDescription>
         <CardDescription className="text-xs text-muted-foreground pt-2">
          (Log in with an admin account to access the dashboard. Other users can sign up.)
        </CardDescription>
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
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="email">Email</Label>
                  <FormControl>
                    <Input id="email" type="email" placeholder="you@example.com" {...field} required className="text-base" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                   <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <Button variant="link" size="sm" asChild className="p-0 text-xs h-auto text-muted-foreground">
                        <Link href="/auth/forgot-password">Forgot Password?</Link>
                    </Button>
                  </div>
                  <FormControl>
                    <Input id="password" type="password" placeholder="••••••••" {...field} required className="text-base" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full font-headline" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Log In
            </Button>
            <div className="flex justify-between w-full text-xs">
                <Button variant="link" size="sm" asChild className="p-0 text-muted-foreground">
                    <Link href="/">Back to Main Site</Link>
                </Button>
                <Button variant="link" size="sm" asChild className="p-0 text-muted-foreground">
                    <Link href="/auth/signup">Don't have an account? Sign Up</Link>
                </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
