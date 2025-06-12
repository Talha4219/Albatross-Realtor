
"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ShieldCheck, ArrowDownCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      // If search term is empty, perhaps focus the input or do nothing
      // For now, let's just prevent navigation if empty
      console.log("Search term is empty");
    }
  };

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] md:h-[calc(100vh-64px)] md:min-h-[600px] flex items-center justify-center text-white overflow-hidden">
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxyZWFsZXN0YXRlfGVufDB8fHx8MTc0OTcwNDcwOXww&ixlib=rb-4.1.0&q=80&w=1080"
        alt="Modern properties and city skyline"
        layout="fill"
        objectFit="cover"
        className="z-0 opacity-80"
        priority
        data-ai-hint="house exterior"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10"></div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 flex flex-col items-center text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-headline !leading-tight">
          Find Your Dream Property
        </h1>
        <p className="mt-4 text-lg sm:text-xl md:text-2xl max-w-3xl opacity-90">
          Explore verified homes, plots, and commercial properties with AI-powered assistance. Your next chapter starts here.
        </p>

        {/* Search Bar */}
        <form
          className="mt-8 w-full max-w-xl flex flex-col sm:flex-row items-center gap-3 p-2 bg-white/10 backdrop-blur-sm rounded-lg shadow-xl"
          onSubmit={handleSearchSubmit}
        >
          <Input
            type="text"
            placeholder="Search by City, Area, or Property Type..."
            className="flex-grow !text-base text-foreground placeholder:text-muted-foreground h-12 px-4"
            aria-label="Search properties"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit" size="lg" className="w-full sm:w-auto h-12 font-headline">
            <Search className="mr-2 h-5 w-5" />
            Search
          </Button>
        </form>

        {/* Trust Element */}
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary/80 px-4 py-2 text-sm font-medium shadow-md">
          <ShieldCheck className="h-5 w-5" />
          <span>100% Verified Listings</span>
        </div>
        
        {/* Secondary CTA */}
        <div className="mt-8">
          <Button variant="outline" size="lg" asChild className="bg-transparent border-white text-white hover:bg-white hover:text-primary font-headline">
            <Link href="#property-search-section">
              Explore All Properties
              <ArrowDownCircle className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        {/* AI Chat Prompt */}
        <p className="mt-10 text-xs opacity-70">
          Need help? Our AI assistant is ready in the bottom right corner!
        </p>
      </div>
    </div>
  );
}
