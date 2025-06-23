
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MessageSquareQuote, PlusCircle, Trash2, Loader2, AlertTriangle, Star } from 'lucide-react';
import type { Testimonial } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';


export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);

  const fetchTestimonials = useCallback(async () => {
    if (!token) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/testimonials', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);

      const data = await res.json();
      if (data.success) {
        setTestimonials(data.data);
      } else {
        throw new Error(data.error || 'API call failed to fetch testimonials');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [token]);
  
  useEffect(() => {
    if (!isAuthLoading && token) {
        fetchTestimonials();
    }
  }, [token, isAuthLoading, fetchTestimonials]);

  const handleDelete = async () => {
    if (!testimonialToDelete || !token) return;

    try {
      const response = await fetch(`/api/admin/testimonials/${testimonialToDelete.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const result = await response.json();
      if (response.ok && result.success) {
        toast({ title: "Testimonial Deleted" });
        setTestimonials(prev => prev.filter(t => t.id !== testimonialToDelete.id));
      } else {
        throw new Error(result.error || "Failed to delete testimonial.");
      }
    } catch (err) {
      toast({ title: "Delete Failed", description: (err instanceof Error ? err.message : "An unknown error occurred"), variant: "destructive"});
    } finally {
      setTestimonialToDelete(null);
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
        ))}
        <span className="ml-1 text-xs text-muted-foreground">({rating})</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <AlertDialog open={!!testimonialToDelete} onOpenChange={(open) => !open && setTestimonialToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the testimonial from "{testimonialToDelete?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTestimonialToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Testimonials</h1>
          <p className="text-muted-foreground">Add, view, and remove client testimonials.</p>
        </div>
        <Button asChild>
          <Link href="/admin/testimonials/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Testimonial
          </Link>
        </Button>
      </div>

      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardHeader><CardTitle className="font-headline text-destructive flex items-center gap-2"><AlertTriangle />Error Loading</CardTitle></CardHeader>
          <CardContent><p className="text-destructive-foreground">{error}</p></CardContent>
        </Card>
      )}

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>All Testimonials</CardTitle>
          <CardDescription>{isLoading ? 'Loading...' : `Showing ${testimonials.length} testimonials.`}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>
          ) : testimonials.length === 0 && !error ? (
            <div className="text-center py-12">
              <MessageSquareQuote className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium">No testimonials found</h3>
              <p className="mt-1 text-sm text-muted-foreground">Get started by adding a new one.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="flex flex-col sm:flex-row items-start gap-4 p-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={testimonial.imageUrl} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-semibold">{testimonial.name} <span className="text-sm font-normal text-muted-foreground">- {testimonial.role}</span></h4>
                            <blockquote className="text-sm text-muted-foreground mt-1 italic">"{testimonial.quote}"</blockquote>
                        </div>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setTestimonialToDelete(testimonial)}>
                            <Trash2 className="w-4 h-4"/>
                        </Button>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                        {renderStars(testimonial.rating)}
                        {testimonial.successTag && <Badge variant="secondary">{testimonial.successTag}</Badge>}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
