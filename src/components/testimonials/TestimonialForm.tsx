
"use client";

import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const testimonialFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  role: z.string().min(2, "Role must be at least 2 characters."),
  quote: z.string().min(10, "Quote must be at least 10 characters."),
  rating: z.coerce.number().min(1).max(5),
  imageUrl: z.string().url("Image URL must be valid.").optional().or(z.literal('')),
  dataAiHint: z.string().optional(),
  successTag: z.string().optional(),
});

export type TestimonialFormData = z.infer<typeof testimonialFormSchema>;

interface TestimonialFormProps {
  onSubmit: SubmitHandler<TestimonialFormData>;
  initialData?: Partial<TestimonialFormData>;
  isLoading?: boolean;
}

export default function TestimonialForm({ onSubmit, initialData, isLoading }: TestimonialFormProps) {
  const form = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      name: '',
      role: '',
      quote: '',
      rating: 5,
      imageUrl: 'https://placehold.co/80x80.png',
      dataAiHint: '',
      successTag: '',
      ...initialData,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem><FormLabel>Client Name*</FormLabel><FormControl><Input placeholder="e.g., Fatima Ahmed" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="role" render={({ field }) => (
            <FormItem><FormLabel>Client Role*</FormLabel><FormControl><Input placeholder="e.g., First-time Homebuyer" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <FormField control={form.control} name="quote" render={({ field }) => (
          <FormItem><FormLabel>Quote*</FormLabel><FormControl><Textarea placeholder="Tell us about your great experience..." {...field} rows={4} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating: {field.value} / 5 Stars</FormLabel>
              <FormControl>
                <Slider
                  min={1}
                  max={5}
                  step={0.5}
                  defaultValue={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="imageUrl" render={({ field }) => (
                <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input type="url" placeholder="https://placehold.co/80x80.png" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="dataAiHint" render={({ field }) => (
                <FormItem><FormLabel>Image AI Hint</FormLabel><FormControl><Input placeholder="e.g., happy person" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
        </div>
        <FormField control={form.control} name="successTag" render={({ field }) => (
          <FormItem><FormLabel>Success Tag</FormLabel><FormControl><Input placeholder="e.g., Sold in 30 Days" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add Testimonial
        </Button>
      </form>
    </Form>
  );
}
