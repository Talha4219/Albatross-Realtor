
"use client";

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Loader2, Star } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Slider } from '@/components/ui/slider';

const storyFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  story: z.string().min(50, "Your story must be at least 50 characters."),
  rating: z.coerce.number().min(1).max(5),
});

type StoryFormData = z.infer<typeof storyFormSchema>;

export default function ShareStoryPage() {
  const { toast } = useToast();
  const form = useForm<StoryFormData>({
    resolver: zodResolver(storyFormSchema),
    defaultValues: {
      name: "",
      email: "",
      story: "",
      rating: 5,
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit: SubmitHandler<StoryFormData> = (data) => {
    // In a real app, this would submit to an API endpoint
    console.log("Story submitted:", data);
    toast({
      title: "Thank You!",
      description: "We've received your story and appreciate you sharing your experience.",
    });
    form.reset();
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit mb-4">
            <Send className="w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-headline">Share Your Success Story</CardTitle>
          <CardDescription className="text-lg">
            Had a great experience with Albatross Realtor? We'd love to hear about it! Your story inspires our team and helps others on their journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                 <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Your Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                 <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Your Email</FormLabel><FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="rating" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Your Rating: {field.value} / 5 Stars</FormLabel>
                    <FormControl>
                        <Slider
                        min={1} max={5} step={0.5}
                        defaultValue={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField control={form.control} name="story" render={({ field }) => (
                    <FormItem><FormLabel>Your Story</FormLabel><FormControl><Textarea placeholder="Tell us about your experience..." {...field} rows={7}/></FormControl><FormMessage /></FormItem>
                )}/>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit My Story
                </Button>
            </form>
           </Form>
        </CardContent>
      </Card>
    </div>
  );
}
