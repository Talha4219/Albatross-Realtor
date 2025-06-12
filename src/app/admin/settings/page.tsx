
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Globe, Palette, Bell, Lock } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
        <p className="text-muted-foreground">Configure platform-wide settings and preferences.</p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5 text-primary"/> General Settings</CardTitle>
          <CardDescription>Basic platform configuration.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="siteName">Site Name</Label>
            <Input id="siteName" defaultValue="Albatross Realtor" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="adminEmail">Default Admin Email</Label>
            <Input id="adminEmail" type="email" defaultValue="admin@albatrossrealtor.com" />
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox id="maintenanceMode" />
            <Label htmlFor="maintenanceMode" className="font-normal">Enable Maintenance Mode</Label>
          </div>
           <Button>Save General Settings</Button>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Palette className="w-5 h-5 text-primary"/> Appearance</CardTitle>
          <CardDescription>Customize the look and feel of the platform.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="logoUpload">Platform Logo</Label>
            <Input id="logoUpload" type="file" />
            <p className="text-xs text-muted-foreground">Recommended size: 200x50px, PNG format.</p>
          </div>
          <div className="space-y-1">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <Input id="primaryColor" type="color" defaultValue="#3F51B5" className="w-24 h-10 p-1" />
             <p className="text-xs text-muted-foreground">Changes apply to main theme accents (requires theme rebuild or dynamic CSS variables).</p>
          </div>
          <Button>Save Appearance Settings</Button>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5 text-primary"/> Notification Settings</CardTitle>
          <CardDescription>Manage email notifications for admins and users.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex items-center justify-between">
            <Label htmlFor="newUserNotif" className="font-normal flex-grow">Notify on new user registration</Label>
            <Checkbox id="newUserNotif" defaultChecked />
          </div>
           <div className="flex items-center justify-between">
            <Label htmlFor="newListingNotif" className="font-normal flex-grow">Notify on new property submission</Label>
            <Checkbox id="newListingNotif" defaultChecked />
          </div>
           <div className="flex items-center justify-between">
            <Label htmlFor="contactFormNotif" className="font-normal flex-grow">Notify on contact form submission</Label>
            <Checkbox id="contactFormNotif" />
          </div>
          <Button>Save Notification Settings</Button>
        </CardContent>
      </Card>

       <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Lock className="w-5 h-5 text-primary"/> Security Settings</CardTitle>
          <CardDescription>Manage security options for the admin panel.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="adminPassword">Change Admin Password</Label>
            <Input id="adminPassword" type="password" placeholder="New Password"/>
            <Input id="confirmAdminPassword" type="password" placeholder="Confirm New Password"/>
          </div>
           <div className="flex items-center space-x-2 pt-2">
            <Checkbox id="twoFactorAuth" />
            <Label htmlFor="twoFactorAuth" className="font-normal">Enable Two-Factor Authentication (2FA) for Admins</Label>
          </div>
          <Button variant="destructive">Update Security Settings</Button>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground text-center pt-4">
        This is a placeholder settings page. Actual implementation would require backend integration for these settings to take effect.
      </p>
    </div>
  );
}
