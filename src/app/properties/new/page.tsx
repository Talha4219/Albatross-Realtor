
"use client";

import PropertyForm from '@/components/property/PropertyForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Building } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { PropertyFormData } from '@/components/property/PropertyForm';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

export default function NewPropertyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { token, isLoading: isAuthLoading, user } = useAuth(); // Get token and user

  const handleSubmit = async (data: PropertyFormData) => {
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to add a property. Please log in and try again.",
        variant: "destructive",
      });
      router.push('/auth/login?redirect=/properties/new');
      return;
    }

    let responseBodyText: string | null = null;
    let errorMessage = "An unknown error occurred during property submission.";
    let detailedErrorMessage: string | undefined;

    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Send token in header
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        try {
          responseBodyText = await response.text();
          // Try to parse as JSON first
          try {
            const errorData = JSON.parse(responseBodyText);
            if (errorData.error) {
              detailedErrorMessage = typeof errorData.error === 'string' ? errorData.error : JSON.stringify(errorData.error);
            } else if (errorData.message) {
              detailedErrorMessage = typeof errorData.message === 'string' ? errorData.message : JSON.stringify(errorData.message);
            } else if (errorData.details) {
              detailedErrorMessage = `Validation Error: ${JSON.stringify(errorData.details)}`;
            }
          } catch (jsonParseError) {
            // Not JSON, or JSON parsing failed.
            // The raw responseBodyText might be HTML.
          }
        } catch (textParseError) {
          console.error("Failed to even read response body as text:", textParseError);
          // Keep generic error message
        }
        
        const finalMessageToThrow = detailedErrorMessage 
                                      ? detailedErrorMessage 
                                      : `Server Error: ${response.status} ${response.statusText}.`;
        throw new Error(finalMessageToThrow);
      }

      const result = await response.json();
      if (result.success) {
        toast({
          title: "Property Submitted",
          description: `Property "${result.data.address}" has been submitted for approval.`,
          variant: "default",
        });
        // Redirect to admin properties if admin, otherwise to a 'my properties' page or homepage
        if (user?.email === 'admin@albatrossrealtor.com') {
            router.push('/admin/properties');
        } else {
            router.push('/my-properties'); // Or '/' or a success page
        }
        
      } else {
        throw new Error(result.error || "Failed to submit property due to an unknown API error.");
      }
    } catch (error) {
      console.error("Error submitting property form:", error);
      // Log the full HTML if it seems to be the case and we have it
      if (responseBodyText && (responseBodyText.trim().toLowerCase().startsWith('<!doctype') || responseBodyText.trim().toLowerCase().startsWith('<html>'))) {
        console.error("Full HTML response from server:", responseBodyText);
      }
      
      toast({
        title: "Submission Failed",
        description: (error instanceof Error ? error.message : "An unknown error occurred."),
        variant: "destructive",
      });
    }
  };

  if (isAuthLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading authentication details...</p>
      </div>
    );
  }

  if (!user && !isAuthLoading) {
     // Redirect to login if not authenticated and not loading
     // This can be handled more gracefully, e.g., by a wrapper component
     // For now, simple redirect logic if form is accessed directly without auth
     if (typeof window !== 'undefined') {
        router.replace('/auth/login?redirect=/properties/new');
     }
     return <div className="container mx-auto px-4 py-8 text-center"><p>Redirecting to login...</p></div>;
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center gap-2">
            <Building className="w-8 h-8 text-primary" />
            Submit New Property
          </CardTitle>
          <CardDescription className="text-lg">
            Fill in the details below to add a new property listing. It will be reviewed by an admin before going live.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PropertyForm onSubmit={handleSubmit} isLoading={isAuthLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
