"use client";

import dynamic from 'next/dynamic';
import type { Property } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

// Define the dynamic import OUTSIDE the component.
// This creates a single, stable component reference that doesn't change on re-renders.
const Map = dynamic(
    () => import('@/components/map/InteractiveMap'),
    { 
        loading: () => <Skeleton className="w-full h-full" />,
        ssr: false 
    }
);

interface DynamicMapProps {
    properties: Property[];
    className?: string;
}

export default function DynamicMap({ properties, className }: DynamicMapProps) {
    // Now, we just render the stable `Map` component.
    return <Map properties={properties} className={className} />;
}
