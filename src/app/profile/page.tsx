
"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserCircle, KeyRound, Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  profilePictureFile: z
    .any()
    .optional()
    .refine(
      (files) => {
        if (typeof window === 'undefined') return true; // Pass on server
        if (!files || files.length === 0) return true; // Pass if no file
        return files[0].size <= 2 * 1024 * 1024; // Check size on client
      },
      `Max file size is 2MB.`
    )
    .refine(
      (files) => {
        if (typeof window === 'undefined') return true; // Pass on server
        if (!files || files.length === 0) return true; // Pass if no file
        return ['image/jpeg', 'image/png', 'image/webp'].includes(files[0].type); // Check type on client
      },
      'Only .jpg, .png, and .webp formats are supported.'
    ),
});
type ProfileFormData = z.infer<typeof profileFormSchema>;


const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required."),
  newPassword: z.string().min(6, "New password must be at least 6 characters."),
}).refine(data => data.currentPassword !== data.newPassword, {
  message: "New password must be different from the current password.",
  path: ["newPassword"],
});
type PasswordFormData = z.infer<typeof passwordFormSchema>;


export default function ProfilePage() {
  const { user, token, updateUser, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace('/auth/login?redirect=/profile');
    }
  }, [user, isAuthLoading, router]);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || '',
      profilePictureFile: undefined,
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
    },
  });
  
  useEffect(() => {
    if(user) {
        profileForm.reset({
            name: user.name,
            profilePictureFile: undefined,
        });
    }
  }, [user, profileForm]);


  const handleProfileUpdate: SubmitHandler<ProfileFormData> = async (data) => {
    if (!token) return;
    setIsProfileSubmitting(true);
    try {
      const { name, profilePictureFile } = data;
      let profilePictureUrl: string | undefined = user?.profilePictureUrl;

      if (profilePictureFile && profilePictureFile.length > 0) {
        const file = profilePictureFile[0];
        profilePictureUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
      }
      
      const updatePayload = {
        name,
        profilePictureUrl: profilePictureUrl || '',
      };

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatePayload),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        toast({ title: "Profile Updated", description: "Your profile details have been saved." });
        updateUser(result.data); // Update context and localStorage
      } else {
        throw new Error(result.error || "Failed to update profile.");
      }
    } catch (error) {
      toast({ variant: 'destructive', title: "Update Failed", description: (error as Error).message });
    } finally {
      setIsProfileSubmitting(false);
    }
  };

  const handlePasswordChange: SubmitHandler<PasswordFormData> = async (data) => {
     if (!token) return;
    setIsPasswordSubmitting(true);
    try {
      const response = await fetch('/api/profile/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
       if (response.ok && result.success) {
        toast({ title: "Password Changed", description: "Your password has been updated successfully." });
        passwordForm.reset();
      } else {
        throw new Error(result.error || "Failed to change password.");
      }
    } catch (error) {
      toast({ variant: 'destructive', title: "Password Change Failed", description: (error as Error).message });
    } finally {
      setIsPasswordSubmitting(false);
    }
  };


  if (isAuthLoading || !user) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading Profile...</p>
      </div>
    );
  }

  const userInitials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();


  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card className="shadow-xl">
        <CardHeader className="text-center items-center">
          <Avatar className="w-24 h-24 mb-4 border-4 border-primary/20 shadow-md">
            <AvatarImage src={imagePreview || user.profilePictureUrl} alt={user.name} data-ai-hint="person portrait" />
            <AvatarFallback className="text-3xl bg-muted">{userInitials}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl font-headline">{user.name}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details"><UserCircle className="w-4 h-4 mr-2"/>Profile Details</TabsTrigger>
              <TabsTrigger value="password"><KeyRound className="w-4 h-4 mr-2"/>Change Password</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6">
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-6">
                  <FormField control={profileForm.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input placeholder="Your full name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField
                    control={profileForm.control}
                    name="profilePictureFile"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Profile Picture</FormLabel>
                        <FormControl>
                            <Input
                            type="file"
                            accept="image/png, image/jpeg, image/webp"
                            onChange={(e) => {
                                const files = e.target.files;
                                if (files && files.length > 0) {
                                const file = files[0];
                                const previewUrl = URL.createObjectURL(file);
                                setImagePreview(previewUrl);
                                field.onChange(files);
                                } else {
                                field.onChange(null);
                                }
                            }}
                            />
                        </FormControl>
                        <FormDescription>
                            Upload a new picture from your computer. Max 2MB.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isProfileSubmitting} className="w-full">
                    {isProfileSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="password" className="mt-6">
               <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-6">
                    <FormField control={passwordForm.control} name="currentPassword" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl><Input type="password" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={passwordForm.control} name="newPassword" render={({ field }) => (
                        <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl><Input type="password" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <Button type="submit" disabled={isPasswordSubmitting} className="w-full">
                        {isPasswordSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Password
                    </Button>
                </form>
               </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

