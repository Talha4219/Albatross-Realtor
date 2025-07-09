
"use client";

import React from 'react';
import { useForm, useFieldArray, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';

const projectStatuses = ['Upcoming', 'Trending', 'Launched'] as const;

const developmentFormSchema = z.object({
  name: z.string().optional(),
  location: z.string().optional(),
  developer: z.string().optional(),
  imageUrl: z.string().url("Image URL must be valid.").optional(),
  dataAiHint: z.string().optional().refine(value => !value || value.split(' ').length <= 2, {
    message: "AI Hint should be one or two keywords.",
  }),
  description: z.string().optional(),
  keyHighlights: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  status: z.enum(projectStatuses).optional(),
  timeline: z.string().optional(),
  learnMoreLink: z.string().url("Learn more link must be a valid URL.").optional(),
});


export type DevelopmentFormData = z.infer<typeof developmentFormSchema>;

interface DevelopmentFormProps {
  onSubmit: SubmitHandler<DevelopmentFormData>;
  initialData?: Partial<DevelopmentFormData>;
  isLoading?: boolean;
  formType: 'create' | 'edit';
}

export default function DevelopmentForm({ onSubmit, initialData, isLoading, formType }: DevelopmentFormProps) {
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
      ...initialData
    },
  });

  React.useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        keyHighlights: initialData.keyHighlights && initialData.keyHighlights.length > 0 ? initialData.keyHighlights : [''],
        amenities: initialData.amenities && initialData.amenities.length > 0 ? initialData.amenities : [''],
      });
    }
  }, [initialData, form]);

  const { fields: highlightFields, append: appendHighlight, remove: removeHighlight } = useFieldArray({
    control: form.control, name: "keyHighlights",
  });
  const { fields: amenityFields, append: appendAmenity, remove: removeAmenity } = useFieldArray({
    control: form.control, name: "amenities",
  });
  
  const submitButtonText = formType === 'edit' ? 'Update Project' : 'Add Development';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem><FormLabel>Development Name</FormLabel><FormControl><Input placeholder="e.g., Eighteen Islamabad" {...field} /></FormControl><FormMessage /></FormItem>
        )}/>
        <FormField control={form.control} name="location" render={({ field }) => (
          <FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="e.g., Motorway M-2, Islamabad" {...field} /></FormControl><FormMessage /></FormItem>
        )}/>
        <FormField control={form.control} name="developer" render={({ field }) => (
          <FormItem><FormLabel>Developer</FormLabel><FormControl><Input placeholder="e.g., Ora Developers" {...field} /></FormControl><FormMessage /></FormItem>
        )}/>
        <FormField control={form.control} name="imageUrl" render={({ field }) => (
          <FormItem><FormLabel>Main Image URL</FormLabel><FormControl><Input type="url" {...field} /></FormControl><FormMessage /></FormItem>
        )}/>
        <FormField control={form.control} name="dataAiHint" render={({ field }) => (
          <FormItem><FormLabel>Image AI Hint (1-2 keywords)</FormLabel><FormControl><Input placeholder="e.g., modern building" {...field} /></FormControl><FormMessage /></FormItem>
        )}/>
        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Briefly describe the project..." {...field} /></FormControl><FormMessage /></FormItem>
        )}/>
        <div>
          <FormLabel>Key Highlights</FormLabel>
          {highlightFields.map((field, index) => (
            <FormField key={field.id} control={form.control} name={`keyHighlights.${index}`} render={({ field: itemField }) => (
              <FormItem className="flex items-center gap-2 mt-1">
                <FormControl><Input placeholder={`Highlight ${index + 1}`} {...itemField} /></FormControl>
                {highlightFields.length > 1 && <Button type="button" variant="destructive" size="icon" onClick={() => removeHighlight(index)}><Trash2 className="h-4 w-4"/></Button>}
              </FormItem>
            )}/>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => appendHighlight("")} className="mt-2"><PlusCircle className="mr-2 h-4 w-4"/>Add Highlight</Button>
          <FormMessage>{(form.formState.errors.keyHighlights as any)?.root?.message || (form.formState.errors.keyHighlights as any)?.[0]?.message}</FormMessage>
        </div>
        <div>
          <FormLabel>Amenities (Optional)</FormLabel>
          {amenityFields.map((field, index) => (
            <FormField key={field.id} control={form.control} name={`amenities.${index}`} render={({ field: itemField }) => (
              <FormItem className="flex items-center gap-2 mt-1">
                <FormControl><Input placeholder={`Amenity ${index + 1}`} {...itemField} /></FormControl>
                {(amenityFields.length > 1 || (amenityFields.length === 1 && (amenityFields[0] as any).value !== '')) && 
                  <Button type="button" variant="destructive" size="icon" onClick={() => removeAmenity(index)}><Trash2 className="h-4 w-4"/></Button>}
              </FormItem>
            )}/>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => appendAmenity("")} className="mt-2"><PlusCircle className="mr-2 h-4 w-4"/>Add Amenity</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField control={form.control} name="status" render={({ field }) => (
            <FormItem><FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                <SelectContent>{projectStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select><FormMessage />
            </FormItem>
          )}/>
          <FormField control={form.control} name="timeline" render={({ field }) => (
            <FormItem><FormLabel>Timeline</FormLabel><FormControl><Input placeholder="e.g., Completion 2026" {...field} /></FormControl><FormMessage /></FormItem>
          )}/>
        </div>
        <FormField control={form.control} name="learnMoreLink" render={({ field }) => (
          <FormItem><FormLabel>Learn More Link</FormLabel><FormControl><Input type="url" placeholder="https://example.com/project-url" {...field} /></FormControl><FormMessage /></FormItem>
        )}/>
        <div className="pt-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
            {submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  );
}
