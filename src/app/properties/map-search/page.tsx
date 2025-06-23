
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Map, ListFilter, Search } from 'lucide-react';
import type { Metadata } from 'next';
import { Skeleton } from '@/components/ui/skeleton';
import MapPlaceholder from '@/components/map/MapPlaceholder';

export const metadata: Metadata = {
  title: 'Map Search | Albatross Realtor',
  description: 'Search for properties visually on an interactive map to find your perfect home.',
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
  return (
    <div className="h-[calc(100vh-128px)] flex flex-col md:flex-row gap-4 p-4">
        {/* Left Panel - Filters and Listings */}
        <Card className="w-full md:w-1/3 lg:w-1/4 flex flex-col shadow-lg">
            <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2 font-headline text-xl">
                    <ListFilter className="w-5 h-5 text-primary"/>
                    Filters & Results
                </CardTitle>
                 <CardDescription>
                    Map is for illustration only.
                 </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                <Button className="w-full" disabled><Search className="mr-2 w-4 h-4" /> Apply Filters (Soon)</Button>
            </CardContent>
            <div className="flex-grow overflow-y-auto">
                <h3 className="font-semibold px-4 pb-2 text-muted-foreground">Showing 3 of 0 results</h3>
                {/* Skeleton List */}
                <div className="space-y-2 px-2">
                    <SkeletonPropertyItem />
                    <SkeletonPropertyItem />
                    <SkeletonPropertyItem />
                </div>
            </div>
        </Card>

        {/* Right Panel - Map */}
        <div className="w-full md:w-2/3 lg:w-3/4 h-full">
            <MapPlaceholder className="h-full" />
        </div>
    </div>
  );
}
