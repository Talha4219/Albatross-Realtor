
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail } from 'lucide-react';
import type { UserProfile } from '@/types';

const contactFormSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("Please enter a valid email."),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters."),
});
type ContactFormData = z.infer<typeof contactFormSchema>;

interface AgentContactDialogProps {
  agent: UserProfile;
  propertyAddress: string;
}

export default function AgentContactDialog({ agent, propertyAddress }: AgentContactDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: `I'm interested in the property at ${propertyAddress}. Please provide me with more details.`,
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    try {
      const response = await fetch('/api/contact/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          agentEmail: agent.email,
          agentName: agent.name,
          propertyAddress,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to send message.");
      }
      toast({
        title: "Message Sent!",
        description: `Your inquiry has been sent to ${agent.name}.`,
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full font-headline" variant="outline">
          <Mail className="w-4 h-4 mr-2" /> Contact Lister
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Contact {agent.name}</DialogTitle>
          <DialogDescription>
            Send an inquiry about the property at <span className="font-semibold">{propertyAddress}</span>.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Email</FormLabel>
                  <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Phone (Optional)</FormLabel>
                  <FormControl><Input placeholder="Your contact number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl><Textarea {...field} rows={4} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Message
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
