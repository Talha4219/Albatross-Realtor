
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import DevelopmentForm, { type DevelopmentFormData } from '@/components/projects/DevelopmentForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Edit, Loader2, AlertTriangle } from 'lucide-react';
import type { Project } from '@/types';

export default function EditDevelopmentPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { token, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  
  const [project, setProject] = useState<Project | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && token) {
      const fetchProject = async () => {
        setIsLoadingData(true);
        setError(null);
        try {
          const res = await fetch(`/api/admin/developments/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (!res.ok) throw new Error(`Failed to fetch project: ${res.statusText}`);
          const result = await res.json();
          if (result.success) {
            setProject(result.data);
          } else {
            throw new Error(result.error || 'Failed to load project data.');
          }
        } catch (err) {
          console.error("Error fetching project:", err);
          setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
          setIsLoadingData(false);
        }
      };
      fetchProject();
    }
  }, [id, token]);

  const handleUpdate = async (data: DevelopmentFormData) => {
    if (!token || !id) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/developments/${id}`, {
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
          title: "Project Updated",
          description: `Project "${result.data.name}" has been updated successfully.`,
        });
        router.push('/admin/developments');
      } else {
        throw new Error(result.error || "Failed to update project.");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast({
        title: "Update Failed",
        description: (error instanceof Error ? error.message : "An unknown error occurred."),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitialFormData = (projectData: Project): Partial<DevelopmentFormData> => {
    return {
      ...projectData,
    };
  };
  
  if (isAuthLoading || isLoadingData) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="border-destructive bg-destructive/10">
          <CardHeader><CardTitle className="font-headline text-destructive flex items-center gap-2"><AlertTriangle />Error Loading Project</CardTitle></CardHeader>
          <CardContent><p className="text-destructive-foreground">{error}</p></CardContent>
        </Card>
      </div>
    );
  }

  if (!project) {
    return <div className="text-center py-8">Project not found.</div>;
  }
  
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/developments">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Development</h1>
          <p className="text-muted-foreground">Modify the details of your project.</p>
        </div>
      </div>
      
      <Card className="shadow-sm">
         <CardHeader>
          <CardTitle className="flex items-center gap-2"><Edit className="w-5 h-5 text-primary"/> Edit Content</CardTitle>
          <CardDescription>Make changes to the project below.</CardDescription>
        </CardHeader>
        <CardContent>
          <DevelopmentForm 
            onSubmit={handleUpdate} 
            isLoading={isSubmitting} 
            formType="edit"
            initialData={getInitialFormData(project)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
