
"use client";

import React, { useState, Suspense, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Building, Home, LandPlot, Warehouse } from 'lucide-react';
import { cn } from '@/lib/utils';

import PropertyForm, { type PropertyFormData } from '@/components/property/PropertyForm';
import DevelopmentForm, { type DevelopmentFormData } from '@/components/projects/DevelopmentForm';

// New commercial subtypes
const commercialSubTypes = ['Office', 'Shop', 'Warehouse', 'Factory', 'Building', 'Other'] as const;
type CommercialSubType = (typeof commercialSubTypes)[number];


function AddListingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { token, user, isLoading: isAuthLoading } = useAuth();
  
  const initialType = searchParams.get('type');
  
  // Use a single state for the main listing type
  const [listingType, setListingType] = useState<'Property' | 'Plot' | 'Commercial Unit' | 'Development'>(
    initialType === 'Development' ? 'Development' :
    initialType === 'Commercial Unit' ? 'Commercial Unit' : 
    initialType === 'Plot' ? 'Plot' : 'Property'
  );
  
  const [purpose, setPurpose] = useState<'For Sale' | 'For Rent'>('For Sale');

  // Property Subtypes
  const propertySubTypes = ['House', 'Flat', 'Upper Portion', 'Lower Portion', 'Farm House', 'Room', 'Penthouse'] as const;
  type PropertySubType = typeof propertySubTypes[number];
  const [propertySubType, setPropertySubType] = useState<PropertySubType>('House');
  
  // Plot Subtypes
  const plotSubTypes = ['Residential Plot', 'Commercial Plot', 'Agricultural Land', 'Industrial Land', 'Plot File', 'Plot Form'] as const;
  type PlotSubType = typeof plotSubTypes[number];
  const [plotSubType, setPlotSubType] = useState<PlotSubType>('Residential Plot');
  
  // State for Commercial Subtypes
  const [commercialSubType, setCommercialSubType] = useState<CommercialSubType>('Office');


  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // This must be at the top level, before any conditional returns
  const initialDataForForm = useMemo(() => {
    const getInitialDataType = (): PropertyFormData['propertyType'] => {
      switch (listingType) {
        case 'Property': return propertySubType;
        case 'Plot': return plotSubType;
        case 'Commercial Unit': return commercialSubType;
        default: return 'House';
      }
    };
    return { propertyType: getInitialDataType(), status: purpose };
  }, [listingType, propertySubType, plotSubType, commercialSubType, purpose]);


  useEffect(() => {
    if (!isAuthLoading) {
      if (!user) {
        router.replace('/auth/login?redirect=/add-listing');
      } else if (user.role === 'user') {
        toast({
          title: "Access Denied",
          description: "Only agents and admins can add new listings.",
          variant: "destructive",
        });
        router.replace('/');
      }
    }
  }, [user, isAuthLoading, router, toast]);


  const handlePropertySubmit = async (data: PropertyFormData) => {
    if (!token) {
      toast({ title: "Authentication Error", description: "You must be logged in.", variant: "destructive" });
      router.push('/auth/login?redirect=/add-listing');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        let errorMsg = result.error || "Failed to submit listing.";
        // Check for Zod validation details and append them
        if (result.details?.fieldErrors) {
            const fieldErrors = Object.entries(result.details.fieldErrors)
                .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
                .join('; ');
            errorMsg += ` Details: ${fieldErrors}`;
        }
        throw new Error(errorMsg);
      }
      toast({ title: "Listing Submitted", description: `Your listing is now live.`, variant: "default" });
      
      // Correct redirection logic based on user role
      if (user?.role === 'admin') {
        router.push('/admin/properties');
      } else if (user?.role === 'agent') {
        router.push('/agent/properties');
      } else {
        router.push('/my-properties');
      }

    } catch (error) {
      toast({ title: "Submission Failed", description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDevelopmentSubmit = async (data: DevelopmentFormData) => {
    if (!token) {
        toast({ title: "Authentication Error", description: "You must be an admin or agent.", variant: "destructive" });
        return;
    }
    setIsSubmitting(true);
    try {
        const response = await fetch('/api/admin/developments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Failed to submit development project.");
        toast({ title: "Project Submitted", description: `"${data.name}" has been added and is now live.`, variant: "default" });
        router.push('/admin/developments');
    } catch (error) {
        toast({ title: "Submission Failed", description: (error as Error).message, variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };

  const selectionOptions = [
    { type: 'Property', icon: Home, label: 'Property', description: 'List a house, apartment, or condo.' },
    { type: 'Plot', icon: LandPlot, label: 'Plot', description: 'List residential or commercial land.' },
    { type: 'Commercial Unit', icon: Warehouse, label: 'Commercial Unit', description: 'List an office, shop, or warehouse.' },
    { type: 'Development', icon: Building, label: 'New Development', description: 'Add a new building project.' },
  ];
  
  const isDevelopmentFlow = listingType === 'Development';

  if (isAuthLoading || !user || user.role === 'user') {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Verifying access...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Select Listing Type</CardTitle>
          <CardDescription>What would you like to post? Select a type to get started.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {selectionOptions.map(option => (
            <button
                key={option.type}
                onClick={() => setListingType(option.type as any)}
                className={cn(
                'p-3 rounded-lg border-2 text-left transition-all',
                listingType === option.type
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                )}
            >
                <div className="flex items-center gap-1.5 mb-1">
                    <option.icon className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold text-xs">{option.label}</h3>
                </div>
                <p className="text-xs text-muted-foreground">{option.description}</p>
            </button>
          ))}
        </CardContent>
      </Card>
      
      {!isDevelopmentFlow && (
         <Card className="animate-in fade-in-50 duration-300">
            <CardHeader>
                <CardTitle>Select Purpose</CardTitle>
                <CardDescription>Are you looking to sell or rent out your property?</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
                onClick={() => setPurpose('For Sale')}
                className={cn(
                'p-4 rounded-lg border-2 text-center transition-all',
                purpose === 'For Sale'
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                )}
            >
                <h3 className="text-base font-semibold">Sell</h3>
            </button>
            <button
                onClick={() => setPurpose('For Rent')}
                className={cn(
                'p-4 rounded-lg border-2 text-center transition-all',
                purpose === 'For Rent'
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                )}
            >
                <h3 className="text-base font-semibold">Rent</h3>
            </button>
            </CardContent>
        </Card>
      )}

      {listingType === 'Property' && (
        <Card className="animate-in fade-in-50 duration-300">
            <CardHeader>
            <CardTitle>Select Property Sub-Type</CardTitle>
            <CardDescription>Choose the specific type of property you are listing.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {propertySubTypes.map(subType => (
                <button
                key={subType}
                onClick={() => setPropertySubType(subType)}
                className={cn(
                    'p-4 rounded-lg border-2 text-center transition-all',
                    propertySubType === subType
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                )}
                >
                <h3 className="font-semibold text-foreground">{subType}</h3>
                </button>
            ))}
            </CardContent>
        </Card>
      )}

      {listingType === 'Plot' && (
        <Card className="animate-in fade-in-50 duration-300">
            <CardHeader>
            <CardTitle>Select Plot Type</CardTitle>
            <CardDescription>Choose the specific type of plot you are listing.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {plotSubTypes.map(subType => (
                <button
                key={subType}
                onClick={() => setPlotSubType(subType)}
                className={cn(
                    'p-4 rounded-lg border-2 text-center transition-all',
                    plotSubType === subType
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                )}
                >
                <h3 className="font-semibold text-foreground">{subType}</h3>
                </button>
            ))}
            </CardContent>
        </Card>
      )}

      {listingType === 'Commercial Unit' && (
        <Card className="animate-in fade-in-50 duration-300">
            <CardHeader>
            <CardTitle>Select Commercial Sub-Type</CardTitle>
            <CardDescription>Choose the specific type of commercial unit you are listing.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {commercialSubTypes.map(subType => (
                <button
                key={subType}
                onClick={() => setCommercialSubType(subType)}
                className={cn(
                    'p-4 rounded-lg border-2 text-center transition-all',
                    commercialSubType === subType
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                )}
                >
                <h3 className="font-semibold text-foreground">{subType}</h3>
                </button>
            ))}
            </CardContent>
        </Card>
      )}


      <Card>
        <CardHeader>
          <CardTitle>Enter {isDevelopmentFlow ? 'Development' : 'Listing'} Details</CardTitle>
          <CardDescription>Provide the details for your listing.</CardDescription>
        </CardHeader>
        <CardContent>
           { isDevelopmentFlow ? (
             <DevelopmentForm 
                onSubmit={handleDevelopmentSubmit}
                isLoading={isSubmitting}
                formType='create'
             />
           ) : (
             <PropertyForm 
              onSubmit={handlePropertySubmit} 
              isLoading={isSubmitting} 
              initialData={initialDataForForm}
              formType='create'
            />
           )}
        </CardContent>
      </Card>
    </div>
  );
}


export default function AddListingPage() {
    return (
        <Suspense fallback={<div className="flex h-[50vh] w-full items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
            <AddListingContent />
        </Suspense>
    )
}
