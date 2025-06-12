
"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import HeroSection from '@/components/home/HeroSection';
import PropertyCard from '@/components/property/PropertyCard';
import SearchFilters from '@/components/search/SearchFilters';
import type { Property } from '@/types';
import { Button } from '@/components/ui/button';
import { ListFilter, LayoutGrid, Sparkles, BarChart3, Users, HelpCircle, SearchIcon, Frown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import NewProjectsShowcase from '@/components/home/NewProjectsShowcase';
import MarketTrendsShowcase from '@/components/home/MarketTrendsShowcase';
import CtaNewsletterSection from '@/components/home/CtaNewsletterSection';
import WhyChooseUsSection from '@/components/home/WhyChooseUsSection';
import BlogPreviewSection from '@/components/home/BlogPreviewSection';
import { useToast } from "@/hooks/use-toast";


const TestimonialsShowcase = dynamic(() => import('@/components/home/TestimonialsShowcase'), {
  ssr: false,
  loading: () => (
    <div className="container mx-auto px-4 py-12">
      <Skeleton className="h-10 w-1/2 mx-auto mb-4" />
      <Skeleton className="h-6 w-3/4 mx-auto mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  ),
});

const AgentSpotlight = dynamic(() => import('@/components/home/AgentSpotlight'), {
  ssr: false,
  loading: () => (
    <div className="container mx-auto px-4 py-12">
      <Skeleton className="h-10 w-1/2 mx-auto mb-4" />
      <Skeleton className="h-6 w-3/4 mx-auto mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-80 w-full" />)}
      </div>
    </div>
  ),
});


const ITEMS_PER_PAGE = 6;
const FEATURED_ITEMS_COUNT = 3;

export default function HomePage() {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { toast } = useToast();

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/properties'); // Fetches only 'Approved' properties
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: `Failed to fetch properties: ${res.statusText}` }));
          throw new Error(errorData.error || `Network response was not ok: ${res.status}`);
        }
        const data = await res.json();
        if (data.success) {
          setAllProperties(data.data);
          setFilteredProperties(data.data); 
          // Set featured properties (e.g., first few, or based on a flag if available)
          // Excluding ID '5' was a previous requirement, adjust if needed
          const approvedFeatured = data.data.filter((p: Property) => p.id !== '5').slice(0, FEATURED_ITEMS_COUNT);
          setFeaturedProperties(approvedFeatured);
        } else {
          throw new Error(data.error || "Failed to fetch properties: API success false");
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast({
          title: "Error Fetching Properties",
          description: (error instanceof Error ? error.message : "Could not load property data."),
          variant: "destructive",
        });
        setAllProperties([]); // Clear properties on error
        setFilteredProperties([]);
        setFeaturedProperties([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperties();
  }, [toast]);

  const handleSearch = (filters: any) => {
    setIsLoading(true);
    setCurrentPage(1); 
    
    let tempProperties = [...allProperties]; // Use the fetched (approved) properties

    if (filters.location) {
      const searchTerm = filters.location.toLowerCase();
      tempProperties = tempProperties.filter(p => 
        p.address.toLowerCase().includes(searchTerm) ||
        p.city.toLowerCase().includes(searchTerm) ||
        p.zip.toLowerCase().includes(searchTerm)
      );
    }
    if (filters.minPrice) {
      tempProperties = tempProperties.filter(p => p.price >= filters.minPrice);
    }
    if (filters.maxPrice) {
      tempProperties = tempProperties.filter(p => p.price <= filters.maxPrice);
    }
    if (filters.propertyType && filters.propertyType !== 'Any Type' && filters.propertyType !== '') {
      tempProperties = tempProperties.filter(p => p.propertyType === filters.propertyType);
    }
    if (filters.beds && filters.beds !== 'Any Beds' && filters.beds !== '') {
      tempProperties = tempProperties.filter(p => p.bedrooms >= parseInt(String(filters.beds)));
    }
    if (filters.baths && filters.baths !== 'Any Baths' && filters.baths !== '') {
      tempProperties = tempProperties.filter(p => p.bathrooms >= parseFloat(String(filters.baths)));
    }
    if (filters.minArea) {
      tempProperties = tempProperties.filter(p => p.areaSqFt >= filters.minArea);
    }
    if (filters.maxArea) {
      tempProperties = tempProperties.filter(p => p.areaSqFt <= filters.maxArea);
    }
    if (filters.isFurnished) {
      tempProperties = tempProperties.filter(p => p.features && p.features.some(feature => feature.toLowerCase() === 'furnished'));
    }
    if (filters.hasPool) {
      tempProperties = tempProperties.filter(p => p.features && p.features.some(feature => feature.toLowerCase().includes('pool')));
    }
    
    setFilteredProperties(tempProperties);
    setTimeout(() => { // Simulate filter application delay if needed, or remove for instant
      setIsLoading(false);
    }, 300);
  };

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage, endPage;

    if (totalPages <= maxPagesToShow) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= Math.ceil(maxPagesToShow / 2)) {
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (currentPage + Math.floor(maxPagesToShow / 2) >= totalPages) {
        startPage = totalPages - maxPagesToShow + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - Math.floor(maxPagesToShow / 2);
        endPage = currentPage + Math.floor(maxPagesToShow / 2);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center items-center space-x-1 sm:space-x-2 mt-10 pt-6 border-t">
        <Button 
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
        >
          Previous
        </Button>
        {startPage > 1 && (
          <>
            <Button size="sm" variant="outline" onClick={() => setCurrentPage(1)}>1</Button>
            {startPage > 2 && <span className="text-muted-foreground px-1">...</span>}
          </>
        )}
        {pageNumbers.map(page => (
          <Button 
            key={page} 
            onClick={() => setCurrentPage(page)}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            className="hidden sm:inline-flex"
          >
            {page}
          </Button>
        ))}
         {currentPage < totalPages && totalPages > maxPagesToShow && !pageNumbers.includes(currentPage) && (
            <Button 
                variant="default"
                size="sm"
                className="sm:hidden"
            >
                {currentPage}
            </Button>
        )}
        {endPage < totalPages && (
           <>
            {endPage < totalPages -1 && <span className="text-muted-foreground px-1">...</span>}
            <Button size="sm" variant="outline" onClick={() => setCurrentPage(totalPages)}>{totalPages}</Button>
          </>
        )}
        <Button 
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
        >
          Next
        </Button>
      </div>
    );
  };
  
  const renderSkeletons = (count: number) => (
    Array.from({ length: count }).map((_, index) => (
      <div key={index} className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <Skeleton className="h-48 w-full rounded-t-lg" />
        <div className="p-4 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <div className="flex justify-between pt-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      </div>
    ))
  );


  return (
    <div className="space-y-0">
      <HeroSection />
      
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary text-center mb-2">
            Explore Featured Properties
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
            Discover handpicked, verified homes, plots, and commercial properties tailored to your needs.
          </p>
          
          {isLoading ? ( 
            <div className={`grid grid-cols-1 md:grid-cols-2 ${viewMode === 'grid' ? 'lg:grid-cols-3' : ''} gap-6`}>
              {renderSkeletons(FEATURED_ITEMS_COUNT)}
            </div>
          ) : featuredProperties.length > 0 ? (
            <div className={`grid grid-cols-1 md:grid-cols-2 ${viewMode === 'grid' ? 'lg:grid-cols-3' : ''} gap-6`}>
              {featuredProperties.map(property => (
                <PropertyCard key={`featured-${property.id}`} property={property} />
              ))}
            </div>
          ) : (
             <div className="text-center py-10 text-muted-foreground">No featured properties available at the moment.</div>
          )}


          <div className="mt-10 text-center">
            <p className="font-semibold text-accent">All Featured Properties are 100% Verified & Approved</p>
          </div>

          <div className="mt-10 text-center space-y-4">
            <Button size="lg" variant="default" asChild className="font-headline">
              <Link href="#property-search-section">See All Properties</Link>
            </Button>
             <div className="text-sm text-muted-foreground space-x-4">
              <Link href="/new-projects" className="hover:text-primary hover:underline">Explore New Projects</Link>
              <span className="text-muted-foreground/50">|</span>
              <Link href="/agents/find" className="hover:text-primary hover:underline">Find an Agent</Link>
            </div>
          </div>
        </div>
      </section>

      <NewProjectsShowcase />
      <MarketTrendsShowcase />
      <TestimonialsShowcase />
      <AgentSpotlight />
      <BlogPreviewSection />
      <WhyChooseUsSection />
      <CtaNewsletterSection />
      
      <div id="property-search-section" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <SearchFilters onSearch={handleSearch} />
          
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-lg font-semibold text-foreground">
              {isLoading && !paginatedProperties.length ? 'Searching...' : `${filteredProperties.length} Approved Properties Found`}
            </p>
            <div className="flex items-center gap-2 mt-3 sm:mt-0">
              <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('grid')}>
                <LayoutGrid className="mr-2 h-4 w-4" /> Grid
              </Button>
              <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('list')}>
                <ListFilter className="mr-2 h-4 w-4" /> List
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className={`grid grid-cols-1 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : ''} gap-6`}>
              {renderSkeletons(ITEMS_PER_PAGE)}
            </div>
          ) : paginatedProperties.length > 0 ? (
            <div className={`grid grid-cols-1 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'} gap-6 ${viewMode === 'list' ? 'lg:gap-4' : 'lg:grid-cols-3'}`}>
              {paginatedProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed rounded-lg bg-background">
                <Frown className="w-20 h-20 mx-auto text-muted-foreground mb-6" />
                <h2 className="text-2xl font-semibold text-foreground mb-2">No Properties Match Your Filters</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Try adjusting your search criteria or view all available properties.
                </p>
                <Button onClick={() => {
                  const searchFiltersComponent = document.querySelector('#property-search-section form');
                  if (searchFiltersComponent && typeof (searchFiltersComponent as HTMLFormElement).reset === 'function') {
                     (searchFiltersComponent as HTMLFormElement).reset();
                  }
                  handleSearch({}); 
                 }} 
                 size="lg" 
                 className="font-headline"
                > 
                  Clear Filters & View All Approved
                </Button>
            </div>
          )}
          {renderPagination()}
        </div>
      </div>
    </div>
  );
}
