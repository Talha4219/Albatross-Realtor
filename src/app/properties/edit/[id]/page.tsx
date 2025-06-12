
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PropertyForm, { type PropertyFormData } from '@/components/property/PropertyForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Building, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { Property as PropertyType } from '@/types';

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { toast } = useToast();
  const { token, user, isLoading: isAuthLoading } = useAuth();
  
  const [property, setProperty] = useState<PropertyType | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && token) {
      const fetchProperty = async () => {
        setIsLoadingData(true);
        setError(null);
        try {
          const res = await fetch(`/api/properties/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || `Failed to fetch property: ${res.statusText}`);
          }
          const result = await res.json();
          if (result.success) {
            setProperty(result.data);
          } else {
            throw new Error(result.error || 'Failed to load property data.');
          }
        } catch (err) {
          console.error("Error fetching property:", err);
          setError(err instanceof Error ? err.message : "An unknown error occurred while fetching property details.");
          toast({ title: "Error", description: err instanceof Error ? err.message : "Could not load property.", variant: "destructive" });
        } finally {
          setIsLoadingData(false);
        }
      };
      fetchProperty();
    } else if (!isAuthLoading && !token) {
        setError("Authentication required to edit properties.");
        setIsLoadingData(false);
        router.push('/auth/login?redirect=/properties/edit/' + id);
    }
  }, [id, token, toast, router, isAuthLoading]);

  const handleSubmit = async (data: PropertyFormData) => {
    if (!token || !id) {
      toast({ title: "Error", description: "Cannot submit. Missing token or property ID.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        toast({
          title: "Property Updated",
          description: `Property "${result.data.address}" has been updated successfully.`,
          variant: "default",
        });
        if (user?.role === 'admin') {
            router.push('/admin/properties');
        } else {
            router.push('/my-properties'); // Or to the property detail page
        }
      } else {
        throw new Error(result.error || "Failed to update property.");
      }
    } catch (error) {
      console.error("Error updating property form:", error);
      toast({
        title: "Update Failed",
        description: (error instanceof Error ? error.message : "An unknown error occurred."),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading || isLoadingData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading property details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-destructive bg-destructive/10">
            <CardHeader><CardTitle className="font-headline text-destructive flex items-center gap-2"><AlertTriangle className="w-6 h-6" />Error Loading Property</CardTitle></CardHeader>
            <CardContent><p className="text-destructive-foreground">{error}</p></CardContent>
        </Card>
      </div>
    );
  }
  
  if (!property) {
     return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">Property not found or you do not have access.</p>
      </div>
    );
  }

  // Map PropertyType to PropertyFormData
  const initialFormData: Partial<PropertyFormData> = {
    ...property,
    price: property.price ?? 0, // Ensure price is number
    bedrooms: property.bedrooms ?? 0,
    bathrooms: property.bathrooms ?? 0,
    areaSqFt: property.areaSqFt ?? 0,
    yearBuilt: property.yearBuilt ?? null,
    images: property.images && property.images.length > 0 ? property.images : [''],
    features: property.features && property.features.length > 0 ? property.features : [''],
    agentId: property.agent?.id ?? null, // Assuming agent has an id
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center gap-2">
            <Building className="w-8 h-8 text-primary" />
            Edit Property
          </CardTitle>
          <CardDescription className="text-lg">
            Update the details for: <span className="font-semibold">{property.address}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PropertyForm 
            onSubmit={handleSubmit} 
            initialData={initialFormData} 
            isLoading={isSubmitting}
            formType="edit"
          />
        </CardContent>
      </Card>
    </div>
  );
}
