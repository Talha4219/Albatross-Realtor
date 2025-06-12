
"use client";

import Link from 'next/link';
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  Home,
  Building2,
  Sparkles,
  Users,
  Library,
  Search,
  UserCircle2,
  Menu,
  ChevronDown,
  XIcon,
  LogIn,
  LogOut,
  LayoutDashboard,
  UserPlus,
  Map, // Added Map icon
  TrendingUp, // Added TrendingUp icon
  CalendarClock, // Added CalendarClock icon
  Briefcase, // Added Briefcase icon (used for Agent Tools)
  BookOpen, // Added BookOpen icon (used for Blog)
  BarChart3, // Added BarChart3 icon (used for Market Trends)
  Compass, // Added Compass icon (used for Guides)
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext'; 
import { ThemeToggle } from '@/components/theme/ThemeToggle'; 

interface NavSubItem {
  title: string;
  href: string;
  description?: string;
  icon?: React.ElementType;
}

interface NavItem {
  title: string;
  href?: string;
  icon?: React.ElementType;
  subItems?: NavSubItem[];
}

const navItems: NavItem[] = [
  // { title: 'Home', href: '/', icon: Home },
  {
    title: 'Properties',
    icon: Building2,
    subItems: [
      { title: 'For Sale', href: '/properties/for-sale', description: 'Homes, plots, commercial', icon: Building2 },
      { title: 'For Rent', href: '/properties/for-rent', description: 'Houses, apartments, shops', icon: Building2 },
      { title: 'Map Search', href: '/properties/map-search', description: 'Visualize on map', icon: Map },
    ],
  },
  {
    title: 'New Projects',
    icon: Sparkles,
    subItems: [
      { title: 'Trending Projects', href: '/new-projects/trending', description: 'Popular developments', icon: TrendingUp },
      { title: 'Upcoming Projects', href: '/new-projects/upcoming', description: 'New launches', icon: CalendarClock },
      { title: 'All New Projects', href: '/new-projects', description: 'View all developments', icon: Sparkles },
    ],
  },
  {
    title: 'Agents',
    icon: Users,
    subItems: [
      { title: 'Find an Agent', href: '/agents/find', description: 'Search verified agents', icon: Users },
      { title: 'Agent Tools', href: '/agents/tools', description: 'CRM and advertising (for agents)', icon: Briefcase },
    ],
  },
  {
    title: 'Resources',
    icon: Library,
    subItems: [
      { title: 'Blog', href: '/blog', description: 'Real estate articles', icon: BookOpen },
      { title: 'Market Trends', href: '/market-trends', description: 'Price index and insights', icon: BarChart3 },
      { title: 'Guides', href: '/guides', description: 'Buyer, seller, renter guides', icon: Compass },
    ],
  },
];

const ADMIN_EMAIL = 'admin@albatrossrealtor.com';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [desktopSearchTerm, setDesktopSearchTerm] = useState('');
  const [mobileSearchTerm, setMobileSearchTerm] = useState('');
  const { user, logout, isLoading: isAuthLoading } = useAuth(); 

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { 
        setIsMobileSearchOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearchSubmit = (term: string) => {
    if (term.trim()) {
      router.push(`/search?q=${encodeURIComponent(term.trim())}`);
      setIsMobileSearchOpen(false); 
      setDesktopSearchTerm(''); 
      setMobileSearchTerm('');
    }
  };

  const handleLogout = () => {
    logout();
  };

  const renderNavLinks = (isMobile = false) => (
    <>
      {navItems.map((item) =>
        item.href ? (
          <Link
            key={item.title}
            href={item.href}
            onClick={() => isMobile && setIsMobileMenuOpen(false)}
            className={cn(
              "text-sm font-medium transition-colors py-2 px-3 rounded-md flex items-center gap-1.5",
              pathname === item.href
                ? "bg-primary/10 text-primary dark:bg-primary/20"
                : "text-foreground/70 hover:text-foreground hover:bg-muted/50",
              isMobile ? "text-base w-full justify-start" : ""
            )}
          >
            {item.icon && <item.icon className="h-4 w-4" />}
            {item.title}
          </Link>
        ) : (
          <DropdownMenu key={item.title}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted/50 py-2 px-3 flex items-center gap-1.5",
                  isMobile ? "text-base w-full justify-start" : "",
                  item.subItems && item.subItems.some(sub => sub.href && (pathname.startsWith(sub.href) || (sub.href === '/new-projects' && pathname === '/new-projects'))) ? "bg-primary/10 text-primary dark:bg-primary/20" : ""
                )}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.title}
                {!isMobile && <ChevronDown className="h-4 w-4 ml-1 opacity-70" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64"> {/* Increased width for descriptions */}
              {item.subItems?.map((subItem) => (
                <DropdownMenuItem key={subItem.title} asChild>
                  <Link 
                    href={subItem.href} 
                    onClick={() => isMobile && setIsMobileMenuOpen(false)}
                    className={cn("flex flex-col items-start p-2", pathname === subItem.href ? "bg-muted font-medium" : "")}
                  >
                    <div className="flex items-center gap-2">
                      {subItem.icon && <subItem.icon className="h-4 w-4 text-muted-foreground" />}
                      <span className="font-medium">{subItem.title}</span>
                    </div>
                    {subItem.description && <p className="text-xs text-muted-foreground mt-0.5 ml-6">{subItem.description}</p>}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      )}
    </>
  );
  
  const renderMobileNavLinks = () => (
    <div className="flex flex-col space-y-1 p-2">
      {navItems.map((item) =>
        item.href ? (
           <SheetClose asChild key={item.title + "-mobile-direct"}>
            <Link
              href={item.href}
              className={cn(
                "text-base font-medium transition-colors py-3 px-3 rounded-md flex items-center gap-2", 
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/80 hover:text-foreground hover:bg-muted"
              )}
            >
              {item.icon && <item.icon className="h-5 w-5" />}
              {item.title}
            </Link>
          </SheetClose>
        ) : (
          <div key={item.title + "-mobile-group"} className="py-1">
            <h4 className="px-3 py-2 text-sm font-semibold text-muted-foreground flex items-center gap-2">
              {item.icon && <item.icon className="h-5 w-5" />}
              {item.title}
            </h4>
            {item.subItems?.map((subItem) => (
              <SheetClose asChild key={subItem.title + "-mobile-sub"}>
                <Link
                  href={subItem.href}
                  className={cn(
                    "text-base font-normal transition-colors py-2.5 pl-8 pr-3 rounded-md flex items-center gap-2",
                     pathname === subItem.href
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground/70 hover:text-foreground hover:bg-muted"
                  )}
                >
                   {subItem.icon && <subItem.icon className="h-4 w-4 text-muted-foreground" />}
                  {subItem.title}
                </Link>
              </SheetClose>
            ))}
          </div>
        )
      )}
    </div>
  );


  return (
    <header className="bg-background border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        {/* Left: Logo and Mobile Menu Toggle */}
        <div className="flex items-center gap-2">
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
                <SheetHeader className="border-b p-4">
                  <SheetTitle className="flex items-center gap-2">
                     <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                      <Image
              src="/logo.png"
              width={500}
              height={500}
              alt="albatross realtor"
            />
                        {/* <Home className="h-7 w-7 text-primary" />
                        <span className="text-xl font-headline font-semibold text-foreground">Albatross Realtor</span> */}
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="py-2">
                  {renderMobileNavLinks()}
                </div>
                 <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                    <XIcon className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </SheetClose>
              </SheetContent>
            </Sheet>
          </div>
          <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
           <Image
              src="/logo.png"
              width={500}
              height={500}
              alt="albatross realtor"
            />
            {/* <Home className="h-8 w-8 text-primary hidden sm:block" />
            <h1 className="text-2xl font-headline font-semibold">Albatross Realtor</h1> */}
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        {!isMobileSearchOpen && (
          <nav className="hidden md:flex items-center gap-1">
            {renderNavLinks()}
          </nav>
        )}
        
        {/* Right: Search, Theme Toggle and Account */}
        <div className="flex items-center gap-1 sm:gap-2"> 
          {/* Mobile Search Icon / Bar */}
          <div className="md:hidden">
            {isMobileSearchOpen ? (
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSearchSubmit(mobileSearchTerm); }}
                className="flex items-center gap-1 absolute inset-x-0 top-0 bg-background p-2 border-b h-16 shadow-md z-10"
              >
                <Input
                  type="search"
                  placeholder="Search website..."
                  className="h-10 flex-grow"
                  autoFocus
                  value={mobileSearchTerm}
                  onChange={(e) => setMobileSearchTerm(e.target.value)}
                  aria-label="Search website"
                />
                 <Button type="submit" variant="ghost" size="icon" aria-label="Submit search">
                  <Search className="h-6 w-6" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileSearchOpen(false)} aria-label="Close search">
                  <XIcon className="h-6 w-6" />
                </Button>
              </form>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setIsMobileSearchOpen(true)} aria-label="Open search">
                <Search className="h-6 w-6" />
              </Button>
            )}
          </div>

          {/* Desktop Search Bar */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSearchSubmit(desktopSearchTerm); }}
            className="hidden md:block md:w-48 lg:w-64 xl:w-72" // Adjusted widths
          >
            <div className="relative">
                <Input
                type="search"
                placeholder="Search website..."
                className="h-10 pr-10" 
                value={desktopSearchTerm}
                onChange={(e) => setDesktopSearchTerm(e.target.value)}
                aria-label="Search website"
                />
                <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2 h-9 w-9" aria-label="Submit search">
                    <Search className="h-5 w-5 text-muted-foreground"/>
                </Button>
            </div>
          </form>
          
          {/* Theme Toggle - Desktop */}
          <div className="hidden md:block">
            <ThemeToggle />
          </div>

          {/* Account Menu */}
           {!isMobileSearchOpen && !isAuthLoading && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full" aria-label="User Account">
                  <UserCircle2 className="h-7 w-7" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {user ? (
                  user.role === 'admin' ? ( // Check role for admin
                    <>
                      <DropdownMenuLabel className="truncate">Admin: {user.name}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" />Admin Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/settings">Admin Settings</Link>
                      </DropdownMenuItem>
                    </>
                  ) : (
                     <>
                      <DropdownMenuLabel className="truncate">{user.name}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild><Link href="/profile">My Profile</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link href="/saved">Saved Properties</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link href="/properties/new">Add Property</Link></DropdownMenuItem>
                    </>
                  )
                ) : (
                  <>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  </>
                )}
                
                {user && <DropdownMenuSeparator />}
                
                {user ? (
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/login"><LogIn className="mr-2 h-4 w-4" />Log In</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/signup"><UserPlus className="mr-2 h-4 w-4" />Sign Up</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
           )}
           {/* Theme Toggle - Mobile (appears to the right of Account or Search icon) */}
          <div className="md:hidden">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
