
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Search, Bell, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    logout();
  };
  
  const adminInitials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 
                       user?.email ? user.email.substring(0, 2).toUpperCase() : "AD";

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/admin/users?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
       <SidebarTrigger className="sm:hidden" />
      <div className="relative flex-1 md:grow-0">
        <h1 className="text-lg font-semibold text-foreground">Dashboard Overview</h1>
      </div>
      <form onSubmit={handleSearchSubmit} className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search users..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
       <Button variant="outline" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
        </span>
        <span className="sr-only">Notifications</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://placehold.co/40x40.png" alt={user?.name || 'Admin Avatar'} data-ai-hint="person avatar"/>
              <AvatarFallback>{adminInitials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{user?.name || user?.email || "Admin Account"}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/admin/settings">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/">View Main Site</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive focus:bg-destructive/10">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
