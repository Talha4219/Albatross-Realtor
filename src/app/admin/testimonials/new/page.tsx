
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import TestimonialForm, { type TestimonialFormData } from '@/components/testimonials/TestimonialForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, MessageSquareQuote } from 'lucide-react';

export default function NewTestimonialPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { token } = useAuth();
  const { toast } = useToast();

  const handleCreateTestimonial = async (data: TestimonialFormData) => {
    if (!token) {
      toast({ title: "Authentication Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        toast({
          title: "Testimonial Added",
          description: "The new testimonial has been successfully created.",
        });
        router.push('/admin/testimonials');
      } else {
        throw new Error(result.error || "Failed to create testimonial.");
      }
    } catch (error) {
      console.error("Error creating testimonial:", error);
      toast({
        title: "Creation Failed",
        description: (error instanceof Error ? error.message : "An unknown error occurred."),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/testimonials">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Testimonial</h1>
          <p className="text-muted-foreground">Fill out the details for the new client testimonial.</p>
        </div>
      </div>
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><MessageSquareQuote className="w-5 h-5 text-primary"/> Testimonial Details</CardTitle>
          <CardDescription>Fill out the form below. Fields marked with * are required.</CardDescription>
        </CardHeader>
        <CardContent>
          <TestimonialForm 
            onSubmit={handleCreateTestimonial} 
            isLoading={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}
