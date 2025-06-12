
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Users, Building, Settings, ShieldAlert, UserCircle, LogOut, Sparkles } from 'lucide-react'; // Added Sparkles
import { cn } from '@/lib/utils';
import { Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from '@/components/ui/sidebar'; 
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

const adminNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/admin/properties', label: 'Manage Properties', icon: Building },
  { href: '/admin/developments', label: 'New Developments', icon: Sparkles }, // New Item
  { href: '/admin/agents', label: 'Manage Agents', icon: Users },
  { href: '/admin/users', label: 'Manage Users', icon: UserCircle },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth(); // Get user object and logout from context

  const handleLogout = () => {
    logout();
  };

  const adminInitials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 
                       user?.email ? user.email.substring(0, 2).toUpperCase() : "AD";


  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Button variant="ghost" className="w-full justify-start gap-2 px-2 text-lg font-semibold" asChild>
          <Link href="/admin/dashboard">
            <ShieldAlert className="h-7 w-7 text-primary" />
            <span className="text-sidebar-foreground group-data-[collapsible=icon]:hidden">Admin Panel</span>
          </Link>
        </Button>
      </SidebarHeader>
      <SidebarContent className="flex-grow">
        <SidebarMenu>
          {adminNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href))}
                tooltip={{children: item.label}}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-2 space-y-2">
         <div className="flex items-center gap-2 p-2 group-data-[collapsible=icon]:justify-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://placehold.co/40x40.png" alt={user?.name || "Admin"} data-ai-hint="person avatar"/>
              <AvatarFallback>{adminInitials}</AvatarFallback>
            </Avatar>
            <div className="text-sm group-data-[collapsible=icon]:hidden">
              <p className="font-semibold text-sidebar-foreground truncate max-w-[120px]">{user?.name || user?.email || 'Admin User'}</p>
            </div>
          </div>
          <SidebarMenuButton
            onClick={handleLogout}
            className="w-full group-data-[collapsible=icon]:justify-center"
            tooltip={{children: "Logout"}}
            variant="outline"
          >
            <LogOut />
            <span className="group-data-[collapsible=icon]:hidden">Logout</span>
          </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}

