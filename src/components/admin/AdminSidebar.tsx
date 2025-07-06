
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Users, Building, Settings, ShieldAlert, UserCircle, LogOut, Sparkles, BookText, PlusCircle, TrendingUp, CalendarClock, MessageSquareQuote, LandPlot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarSeparator, SidebarGroupLabel } from '@/components/ui/sidebar'; 
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

const adminNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutGrid, type: 'item' },
  { type: 'separator' },
  { type: 'heading', label: 'Properties' },
  { href: '/admin/properties', label: 'All Properties', icon: Building, isSubItem: true, type: 'item' },
  { href: '/add-listing?type=Property', label: 'Add Property', icon: PlusCircle, isSubItem: true, type: 'item' },
  { type: 'separator' },
  { type: 'heading', label: 'Plots' },
  { href: '/admin/properties?type=Plot', label: 'All Plots', icon: LandPlot, isSubItem: true, type: 'item' },
  { href: '/add-listing?type=Plot', label: 'Add Plot', icon: PlusCircle, isSubItem: true, type: 'item' },
  { type: 'separator' },
  { type: 'heading', label: 'Projects' },
  { href: '/admin/developments', label: 'All Projects', icon: Sparkles, isSubItem: true, type: 'item' },
  { href: '/admin/developments?status=Trending', label: 'Trending', icon: TrendingUp, isSubItem: true, type: 'item' },
  { href: '/admin/developments?status=Upcoming', label: 'Upcoming', icon: CalendarClock, isSubItem: true, type: 'item' },
  { href: '/add-listing?type=Development', label: 'Add New Project', icon: PlusCircle, isSubItem: true, type: 'item' },
  { type: 'separator' },
  { href: '/admin/blog', label: 'Manage Blog', icon: BookText, type: 'item' },
  { href: '/blog/new', label: 'Create Post', icon: PlusCircle, type: 'item' },
  { type: 'separator' },
  { href: '/admin/testimonials', label: 'Manage Testimonials', icon: MessageSquareQuote, type: 'item' },
  { type: 'separator' },
  { href: '/admin/users', label: 'Manage Users', icon: UserCircle, type: 'item' },
  { href: '/admin/agents', label: 'Manage Agents', icon: Users, type: 'item' },
  { href: '/admin/settings', label: 'Settings', icon: Settings, type: 'item' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

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
          {adminNavItems.map((item, index) => {
            if (item.type === 'separator') {
              return <SidebarSeparator key={`sep-${index}`} className="my-1" />;
            }
            if (item.type === 'heading') {
              return <SidebarGroupLabel key={`head-${index}`} className="px-2 pt-2 group-data-[collapsible=icon]:hidden">{item.label}</SidebarGroupLabel>;
            }
            if (item.type === 'item') {
              return (
                <SidebarMenuItem key={item.href} className={cn(item.isSubItem && "group-data-[state=expanded]:pl-4")}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href || (item.href && item.href !== '/admin/dashboard' && pathname.startsWith(item.href))}
                    tooltip={{children: item.label}}
                  >
                    <Link href={item.href!}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            }
            return null;
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-2 space-y-2">
         <div className="flex items-center gap-2 p-2 group-data-[collapsible=icon]:justify-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.profilePictureUrl} alt={user?.name || "Admin"} data-ai-hint="person avatar"/>
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
