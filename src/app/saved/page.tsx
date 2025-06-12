"use client";

import PropertyCard from '@/components/property/PropertyCard';
import { useSavedProperties } from '@/contexts/SavedPropertiesContext';
import { HeartCrack } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SavedPropertiesPage() {
  const { savedProperties } = useSavedProperties();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold">Your Saved Properties</h1>
      {savedProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed rounded-lg">
          <HeartCrack className="w-20 h-20 mx-auto text-muted-foreground mb-6" />
          <h2 className="text-2xl font-semibold text-muted-foreground mb-2">No Saved Properties Yet</h2>
          <p className="text-muted-foreground mb-6">
            Start exploring and save properties you&apos;re interested in. They&apos;ll appear here.
          </p>
          <Button asChild size="lg" className="font-headline">
            <Link href="/">Find Properties</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
