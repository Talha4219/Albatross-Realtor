
"use client";

import { Button } from '@/components/ui/button';
import { UserCircle } from 'lucide-react';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';

export default function AgentHeader() {
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
  };
  
  const agentInitials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 
                       user?.email ? user.email.substring(0, 2).toUpperCase() : "AG";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
       <SidebarTrigger className="sm:hidden" />
      <div className="relative flex-1 md:grow-0">
        <h1 className="text-lg font-semibold text-foreground">Agent Dashboard</h1>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profilePictureUrl || ''} alt={user?.name || 'Agent Avatar'} data-ai-hint="person avatar"/>
                <AvatarFallback>{agentInitials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user?.name || user?.email || "Agent Account"}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">My Profile</Link>
            </DropdownMenuItem>
             <DropdownMenuItem asChild>
              <Link href="/">View Main Site</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive focus:bg-destructive/10">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
       </div>
    </header>
  );
}
