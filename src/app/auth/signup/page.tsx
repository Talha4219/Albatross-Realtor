

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2, Info } from 'lucide-react';
import Link from 'next/link';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form'; // ShadCN Form
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from '@/hooks/use-toast';


const signupFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(['user', 'agent'], { required_error: "You must select a role." }),
  phone: z.string().optional(),
}).refine((data) => {
    if (data.role === 'agent') {
        return !!data.phone && data.phone.length > 0;
    }
    return true;
}, {
    message: "Phone number is required for agents.",
    path: ["phone"],
});

type SignupFormData = z.infer<typeof signupFormSchema>;

export default function SignupPage() {
  const [apiError, setApiError] = useState<string | null>(null);
  const { signup, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
      phone: "",
    },
  });

  const role = form.watch('role');

  const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
    setApiError(null);
    const result = await signup(data.name, data.email, data.password, data.role, data.phone);
    
    // AuthContext now handles successful login. We just need to handle navigation.
    if (result.success && result.data?.user) {
        const user = result.data.user;
        toast({
            title: "Signup Successful",
            description: `Welcome to Albatross Realtor, ${user.name}!`,
        });
        if (user.role === 'admin') {
            router.push('/admin/dashboard');
        } else if (user.role === 'agent') {
            router.push('/agent/dashboard');
        } else {
            router.push('/'); // Regular users go to homepage
        }
    } else {
      setApiError(result.error || "Signup failed. The email might already be in use.");
    }
  };

  return (
    <Card className="w-full max-w-lg shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
        <CardDescription>Join Albatross Realtor to find your dream property.</CardDescription>
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
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-3 rounded-lg border p-4">
                  <FormLabel className="font-semibold">I want to register as a...</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-2 pt-2"
                    >
                      <FormItem className="flex items-start space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="user" />
                        </FormControl>
                        <div className="flex-1">
                           <FormLabel className="font-normal leading-none">
                            User
                          </FormLabel>
                           <p className="text-xs text-muted-foreground mt-1">Browse listings, save properties, and connect with agents.</p>
                        </div>
                      </FormItem>
                      <FormItem className="flex items-start space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="agent" />
                        </FormControl>
                         <div className="flex-1">
                           <FormLabel className="font-normal leading-none flex items-center gap-1.5">
                            Agent
                             <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="w-3.5 h-3.5 text-muted-foreground cursor-pointer"/>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-[250px] text-xs">Agents can list properties and create a public profile. Agent accounts require admin approval.</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                          </FormLabel>
                           <p className="text-xs text-muted-foreground mt-1">List properties, manage your portfolio, and connect with clients.</p>
                        </div>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} className="text-base" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} className="text-base" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             {role === 'agent' && (
                <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., 0300-1234567" {...field} className="text-base" />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            )}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} className="text-base" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full font-headline" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Sign Up
            </Button>
            <Button variant="link" size="sm" asChild className="text-xs text-muted-foreground">
              <Link href="/auth/login">Already have an account? Log In</Link>
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
