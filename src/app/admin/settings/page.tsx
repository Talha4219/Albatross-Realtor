
"use client";

import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Globe, Palette, Bell, Lock, Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const settingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required."),
  adminEmail: z.string().email("Invalid admin email."),
  maintenanceMode: z.boolean(),
  primaryColor: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i, "Invalid hex color."),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function AdminSettingsPage() {
    const { toast } = useToast();

    const form = useForm<SettingsFormData>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            siteName: "Albatross Realtor",
            adminEmail: "admin@albatrossrealtor.com",
            maintenanceMode: false,
            primaryColor: "#3F51B5",
        }
    });

    const { isSubmitting } = form.formState;

    const onSubmit: SubmitHandler<SettingsFormData> = async (data) => {
        // In a real app, this would call an API to save settings.
        // For this demo, we'll just simulate a delay and show a toast.
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("Settings submitted:", data);
        toast({
            title: "Settings Saved",
            description: "Your platform settings have been updated.",
        });
    };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
        <p className="text-muted-foreground">Configure platform-wide settings and preferences.</p>
      </div>

     <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="shadow-sm mb-6">
                <CardHeader>
                <CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5 text-primary"/> General Settings</CardTitle>
                <CardDescription>Basic platform configuration.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <FormField control={form.control} name="siteName" render={({ field }) => (
                    <FormItem><FormLabel>Site Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="adminEmail" render={({ field }) => (
                    <FormItem><FormLabel>Default Admin Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="maintenanceMode" render={({ field }) => (
                     <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>Enable Maintenance Mode</FormLabel>
                        </div>
                    </FormItem>
                )}/>
                </CardContent>
            </Card>

             <Card className="shadow-sm mb-6">
                <CardHeader>
                <CardTitle className="flex items-center gap-2"><Palette className="w-5 h-5 text-primary"/> Appearance</CardTitle>
                <CardDescription>Customize the look and feel of the platform.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                 <FormField control={form.control} name="primaryColor" render={({ field }) => (
                    <FormItem><FormLabel>Primary Color</FormLabel>
                    <FormControl>
                        <div className="flex items-center gap-2">
                            <Input type="color" {...field} className="w-16 h-10 p-1" />
                            <Input type="text" {...field} className="w-32" />
                        </div>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}/>
                </CardContent>
            </Card>
            
            <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save All Settings
            </Button>
        </form>
     </Form>

       <Card className="shadow-sm mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Lock className="w-5 h-5 text-primary"/> Security (Placeholder)</CardTitle>
          <CardDescription>Manage security options for the admin panel.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Functionality for changing passwords and enabling 2FA would be built out here with dedicated secure endpoints.</p>
          <Button variant="outline" disabled>Update Security Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}
