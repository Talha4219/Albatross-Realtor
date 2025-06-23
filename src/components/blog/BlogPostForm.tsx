
"use client";

import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { blogCategories, type BlogCategory } from '@/types';

const blogPostFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long."),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters long."),
  content: z.string().min(50, "Content must be at least 50 characters long."),
  imageUrl: z.string().url("Image URL must be a valid URL."),
  dataAiHint: z.string().optional(),
  category: z.enum(blogCategories, { required_error: "Please select a category." }),
  author: z.string().optional(),
  tags: z.string().optional(),
  status: z.enum(['draft', 'published']),
});

export type BlogPostFormData = z.infer<typeof blogPostFormSchema>;

interface BlogPostFormProps {
  onSubmit: SubmitHandler<BlogPostFormData>;
  initialData?: Partial<BlogPostFormData>;
  isLoading?: boolean;
  formType?: 'create' | 'edit';
}

export default function BlogPostForm({ onSubmit, initialData, isLoading, formType = 'create' }: BlogPostFormProps) {
  const form = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      imageUrl: 'https://placehold.co/1200x630.png',
      dataAiHint: '',
      author: '',
      tags: '',
      status: 'draft',
      ...initialData,
      category: initialData?.category || undefined,
    },
  });

  React.useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        category: initialData.category || undefined
      });
    }
  }, [initialData, form]);

  const submitButtonText = formType === 'edit' ? 'Update Post' : 'Create Post';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title*</FormLabel>
              <FormControl><Input placeholder="e.g., How to Buy Your First Home" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt*</FormLabel>
              <FormControl><Textarea placeholder="A short summary of the post..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content (Markdown supported)*</FormLabel>
              <FormControl><Textarea placeholder="Write your full blog post here..." {...field} rows={15} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Main Image URL*</FormLabel>
                <FormControl><Input type="url" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="dataAiHint"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Image AI Hint (1-2 keywords)</FormLabel>
                <FormControl><Input placeholder="e.g., modern building" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
         </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                    <SelectContent>
                        {blogCategories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author (Optional)</FormLabel>
                <FormControl><Input placeholder="e.g., Jane Doe" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (Optional, comma-separated)</FormLabel>
              <FormControl><Input placeholder="e.g., investment, tips, market" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status*</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full font-headline" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {submitButtonText}
        </Button>
      </form>
    </Form>
  );
}
