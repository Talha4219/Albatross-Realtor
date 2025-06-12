
"use client";

import React, { useState } from 'react';
import { useForm, Controller, type SubmitHandler, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Sparkles, ArrowLeft, Loader2, PlusCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const projectStatuses = ['Upcoming', 'Trending', 'Launched'] as const;

const developmentFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  location: z.string().min(3, "Location must be at least 3 characters."),
  developer: z.string().min(2, "Developer name must be at least 2 characters."),
  imageUrl: z.string().url("Image URL must be valid.").default('https://placehold.co/600x400.png'),
  dataAiHint: z.string().optional().refine(value => !value || value.split(' ').length <= 2, {
    message: "AI Hint should be one or two keywords.",
  }),
  description: z.string().optional(),
  keyHighlights: z.array(z.string().min(1, "Highlight cannot be empty.")).min(1, "At least one key highlight is required."),
  amenities: z.array(z.string().min(1, "Amenity cannot be empty.")).optional(),
  status: z.enum(projectStatuses).optional(),
  timeline: z.string().optional(),
  learnMoreLink: z.string().url("Learn more link must be a valid URL.").optional(),
});

type DevelopmentFormData = z.infer<typeof developmentFormSchema>;

export default function AddNewDevelopmentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { token, isLoading: isAuthLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<DevelopmentFormData>({
    resolver: zodResolver(developmentFormSchema),
    defaultValues: {
      name: "",
      location: "",
      developer: "",
      imageUrl: "https://placehold.co/600x400.png",
      dataAiHint: "",
      description: "",
      keyHighlights: [''],
      amenities: [''],
      status: 'Upcoming',
      timeline: "",
      learnMoreLink: "",
    },
  });

  const { fields: highlightFields, append: appendHighlight, remove: removeHighlight } = useFieldArray({
    control: form.control,
    name: "keyHighlights",
  });

  const { fields: amenityFields, append: appendAmenity, remove: removeAmenity } = useFieldArray({
    control: form.control,
    name: "amenities",
  });

  const onSubmit: SubmitHandler<DevelopmentFormData> = async (data) => {
    if (!token) {
      toast({ title: "Authentication Error", description: "Admin token missing.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/developments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        toast({ title: "Development Added", description: `Project "${result.data.name}" created successfully.`, variant: "default" });
        router.push('/admin/developments');
      } else {
        throw new Error(result.error || "Failed to add development.");
      }
    } catch (error) {
      console.error("Error submitting development:", error);
      toast({ title: "Submission Failed", description: (error instanceof Error ? error.message : "An unknown error occurred."), variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isAuthLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }


  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/developments">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Developments</span>
          </Link>
        </Button>
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Add New Development</h1>
            <p className="text-muted-foreground">Enter the details for the new real estate project.</p>
        </div>
      </div>
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary"/> Development Details</CardTitle>
          <CardDescription>Fill out the form below. Fields marked with * are required.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Development Name*</FormLabel><FormControl><Input placeholder="e.g., Skyline Towers" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="location" render={({ field }) => (
                <FormItem><FormLabel>Location*</FormLabel><FormControl><Input placeholder="e.g., Metropolis Downtown" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="developer" render={({ field }) => (
                <FormItem><FormLabel>Developer*</FormLabel><FormControl><Input placeholder="e.g., Prestige Developers Inc." {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="imageUrl" render={({ field }) => (
                <FormItem><FormLabel>Main Image URL*</FormLabel><FormControl><Input type="url" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="dataAiHint" render={({ field }) => (
                <FormItem><FormLabel>Image AI Hint (1-2 keywords)</FormLabel><FormControl><Input placeholder="e.g., modern building" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Briefly describe the project..." {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              
              <div>
                <FormLabel>Key Highlights*</FormLabel>
                {highlightFields.map((field, index) => (
                  <FormField key={field.id} control={form.control} name={`keyHighlights.${index}`} render={({ field: itemField }) => (
                    <FormItem className="flex items-center gap-2 mt-1">
                      <FormControl><Input placeholder={`Highlight ${index + 1}`} {...itemField} /></FormControl>
                      {highlightFields.length > 1 && <Button type="button" variant="destructive" size="icon" onClick={() => removeHighlight(index)}><Trash2 className="h-4 w-4"/></Button>}
                    </FormItem>
                  )}/>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendHighlight("")} className="mt-2"><PlusCircle className="mr-2 h-4 w-4"/>Add Highlight</Button>
                <FormMessage>{form.formState.errors.keyHighlights?.root?.message || form.formState.errors.keyHighlights?.[0]?.message}</FormMessage>
              </div>

              <div>
                <FormLabel>Amenities (Optional)</FormLabel>
                {amenityFields.map((field, index) => (
                  <FormField key={field.id} control={form.control} name={`amenities.${index}`} render={({ field: itemField }) => (
                     <FormItem className="flex items-center gap-2 mt-1">
                      <FormControl><Input placeholder={`Amenity ${index + 1}`} {...itemField} /></FormControl>
                       {(amenityFields.length > 1 || (amenityFields.length === 1 && amenityFields[0].value !== '')) && 
                         <Button type="button" variant="destructive" size="icon" onClick={() => removeAmenity(index)}><Trash2 className="h-4 w-4"/></Button>}
                    </FormItem>
                  )}/>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendAmenity("")} className="mt-2"><PlusCircle className="mr-2 h-4 w-4"/>Add Amenity</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem><FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                      <SelectContent>{projectStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select><FormMessage />
                  </FormItem>
                )}/>
                <FormField control={form.control} name="timeline" render={({ field }) => (
                  <FormItem><FormLabel>Timeline</FormLabel><FormControl><Input placeholder="e.g., Completion Q4 2025" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
              </div>
              <FormField control={form.control} name="learnMoreLink" render={({ field }) => (
                <FormItem><FormLabel>Learn More Link</FormLabel><FormControl><Input type="url" placeholder="https://example.com/project-details" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              
              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={isSubmitting || isAuthLoading}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                  Add Development
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
