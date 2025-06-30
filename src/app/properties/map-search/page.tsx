
"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ListFilter, AlertTriangle, Frown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from "@/hooks/use-toast";
import type { Property } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import Link from 'next/link';

// Dynamically import the InteractiveMap component with SSR turned off.
// Defining it here, outside the component function, ensures it's treated as a stable component.
const InteractiveMap = dynamic(() => import('@/components/map/InteractiveMap'), {
  loading: () => <Skeleton className="w-full h-full" />,
  ssr: false,
});


const isValidImageUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  // Basic check for allowed image hosts or data URIs to prevent errors.
  try {
    const validHostnames = ['images.unsplash.com', 'placehold.co'];
    if (url.startsWith('data:image')) {
      return true;
    }
    const parsedUrl = new URL(url);
    return validHostnames.includes(parsedUrl.hostname);
  } catch (e) {
    // URL parsing failed, so it's not a valid URL.
    return false;
  }
};


const PropertyListItem = ({ property }: { property: Property }) => {
    const imageUrl = (property.images && property.images.length > 0 && isValidImageUrl(property.images[0]))
        ? property.images[0]
        : 'https://placehold.co/100x100.png';

    return (
        <Link href={`/property/${property.id}`} className="block p-2 border-b hover:bg-muted/50 transition-colors">
            <div className="flex items-center space-x-4">
                <Image 
                    src={imageUrl}
                    alt={property.address}
                    width={80}
                    height={80}
                    className="h-16 w-16 rounded-md object-cover"
                    data-ai-hint="property exterior"
                />
                <div className="text-sm overflow-hidden">
                    <p className="font-semibold text-foreground truncate">{property.address}</p>
                    <p className="text-primary font-bold">Rs {property.price.toLocaleString()}</p>
                    <p className="text-muted-foreground text-xs">{property.bedrooms} beds · {property.bathrooms} baths</p>
                </div>
            </div>
        </Link>
    );
};

const SkeletonPropertyItem = () => (
    <div className="flex items-center space-x-4 p-2 border-b">
        <Skeleton className="h-16 w-16 rounded-md" />
        <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
        </div>
    </div>
);

export default function MapSearchPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const fetchProperties = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/properties`);
                if (!res.ok) {
                    throw new Error("Failed to fetch properties for map.");
                }
                const data = await res.json();
                if (data.success) {
                    setProperties(data.data);
                } else {
                    throw new Error(data.error || "API returned an error.");
                }
            } catch (err) {
                const msg = err instanceof Error ? err.message : "An unknown error occurred.";
                setError(msg);
                toast({ title: "Error", description: msg, variant: "destructive" });
            } finally {
                setIsLoading(false);
            }
        };
        fetchProperties();
    }, [toast]);
    
    return (
        <div className="h-[calc(100vh-128px)] flex flex-col md:flex-row gap-4 p-4">
            <Card className="w-full md:w-1/3 lg:w-1/4 flex flex-col shadow-lg">
                <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2 font-headline text-xl">
                        <ListFilter className="w-5 h-5 text-primary"/>
                        Property Results
                    </CardTitle>
                    <CardDescription>
                        {isLoading ? 'Loading...' : `Showing ${properties.length} properties.`}
                    </CardDescription>
                </CardHeader>
                <ScrollArea className="flex-grow">
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="p-2 space-y-2">
                                {[...Array(5)].map((_, i) => <SkeletonPropertyItem key={i} />)}
                            </div>
                        ) : error ? (
                            <div className="p-4 text-center text-destructive">
                                <AlertTriangle className="mx-auto h-8 w-8 mb-2" />
                                <p>{error}</p>
                            </div>
                        ) : properties.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground">
                                <Frown className="mx-auto h-8 w-8 mb-2" />
                                <p>No properties found.</p>
                            </div>
                        ) : (
                            <div>
                                {properties.map(prop => <PropertyListItem key={prop.id} property={prop} />)}
                            </div>
                        )}
                    </CardContent>
                </ScrollArea>
            </Card>

            <div className="w-full md:w-2/3 lg:w-3/4 h-full rounded-lg overflow-hidden shadow-lg">
                <InteractiveMap properties={properties} className="h-full" />
            </div>
        </div>
    );
}
