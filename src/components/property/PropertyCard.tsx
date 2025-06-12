
"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Property } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, BedDouble, Bath, Maximize, MapPin, CheckCircle } from 'lucide-react';
import { useSavedProperties } from '@/contexts/SavedPropertiesContext';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface PropertyCardProps {
  property: Property;
}

const DEFAULT_PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxwcm9wZXJ0eXxlbnwwfHx8fDE3NDk3MDQ5NjR8MA&ixlib=rb-4.1.0&q=80&w=1080';

const isValidPlaceholdCoUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname === 'placehold.co';
  } catch (e) {
    return false;
  }
};

export default function PropertyCard({ property }: PropertyCardProps) {
  const { addSavedProperty, removeSavedProperty, isPropertySaved } = useSavedProperties();
  const { toast } = useToast();
  const isSaved = isPropertySaved(property.id);

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation(); // Stop event bubbling
    if (isSaved) {
      removeSavedProperty(property.id);
      toast({ title: "Property Unsaved", description: `${property.address} removed from your saved list.` });
    } else {
      addSavedProperty(property.id);
      toast({ title: "Property Saved!", description: `${property.address} added to your saved list.` });
    }
  };
  
  const postedDate = new Date(property.postedDate);
  const timeAgo = formatDistanceToNow(postedDate, { addSuffix: true });

  const imageToDisplay = 
    property.images && property.images.length > 0 && (isValidPlaceholdCoUrl(property.images[0]) || property.images[0].startsWith('https://images.unsplash.com'))
    ? property.images[0]
    : DEFAULT_PLACEHOLDER_IMAGE;

  let cardHint = "property exterior";
  if (property.propertyType) {
    const typeLower = property.propertyType.toLowerCase();
    if (typeLower === 'house') cardHint = "house exterior";
    else if (typeLower === 'apartment') cardHint = "apartment building";
    else if (typeLower === 'condo') cardHint = "condo building";
    else if (typeLower === 'townhouse') cardHint = "townhouse exterior";
    else if (typeLower === 'land') cardHint = "land plot";
  }

  return (
    <Link href={`/property/${property.id}`} className="block group">
      <Card className="overflow-hidden h-full flex flex-col hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="p-0 relative">
          <Image
            src={imageToDisplay}
            alt={`Image of ${property.address}`}
            width={400}
            height={250}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={cardHint}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null; 
              target.src = DEFAULT_PLACEHOLDER_IMAGE;
            }}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white text-rose-500 hover:text-rose-600 rounded-full backdrop-blur-sm"
            onClick={handleSaveToggle}
            aria-label={isSaved ? 'Unsave property' : 'Save property'}
          >
            <Heart className={isSaved ? "fill-current" : ""} />
          </Button>
          <Badge className="absolute bottom-2 left-2" variant={property.status === 'For Sale' ? 'default' : property.status === 'For Rent' ? 'secondary' : 'outline' }>{property.status}</Badge>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <div className="flex justify-between items-start">
            <p className="text-2xl font-headline font-semibold text-primary mb-1">
              ${property.price.toLocaleString()}
            </p>
            {property.isVerified && (
              <Badge variant="success" className="text-xs ml-2 flex items-center shrink-0">
                <CheckCircle className="w-3 h-3 mr-1" /> Verified
              </Badge>
            )}
          </div>
          <CardTitle className="text-lg font-medium group-hover:text-primary transition-colors">
            {property.address}
          </CardTitle>
          <p className="text-sm text-muted-foreground flex items-center mt-1">
            <MapPin className="w-4 h-4 mr-1 shrink-0" /> {property.city}, {property.state} {property.zip}
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2 text-sm text-foreground">
            <div className="flex items-center gap-1">
              <BedDouble className="w-4 h-4 text-accent shrink-0" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4 text-accent shrink-0" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-1">
              <Maximize className="w-4 h-4 text-accent shrink-0" />
              <span>{property.areaSqFt.toLocaleString()} sqft</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 border-t mt-auto">
          <div className="w-full flex justify-between items-center text-xs text-muted-foreground">
            <span>{property.propertyType}</span>
            <span>Posted {timeAgo}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
