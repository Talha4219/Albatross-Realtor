
"use client";

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import type { Property, PropertyTypeEnum, UserProfile } from '@/types';
import { PropertyCarousel } from '@/components/property/PropertyCarousel';
import DynamicMap from '@/components/map/DynamicMap';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useSavedProperties } from '@/contexts/SavedPropertiesContext';
import { useToast } from '@/hooks/use-toast';
import { BedDouble, Bath, Maximize, MapPin, CalendarDays, Building, Tag, Phone, Mail, CheckCircle, ExternalLink, Heart, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; 
import { Skeleton } from '@/components/ui/skeleton'; 
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';


export default function PropertyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addSavedProperty, removeSavedProperty, isPropertySaved } = useSavedProperties();
  const { toast } = useToast();
  
  useEffect(() => {
    if (id) {
      const fetchProperty = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/properties/${id}`);
          if (!res.ok) {
            if (res.status === 404) {
              notFound();
            }
            throw new Error('Failed to fetch property data.');
          }
          const result = await res.json();
          if (result.success) {
            setProperty(result.data);
            // Fire-and-forget request to increment view count
            fetch(`/api/properties/${id}/increment-view`, { method: 'PATCH' });
          } else {
            notFound();
          }
        } catch (error) {
          console.error("Error fetching property:", error);
          toast({ title: "Error", description: "Could not load property details.", variant: "destructive" });
          notFound();
        } finally {
          setIsLoading(false);
        }
      };
      fetchProperty();
    }
  }, [id, toast]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <SkeletonPropertyPage />
      </div>
    );
  }

  if (!property) {
    notFound(); 
    return null; 
  }
  
  const isSaved = isPropertySaved(property.id);

  const handleSaveToggle = () => {
    if (isSaved) {
      removeSavedProperty(property.id);
      toast({ title: "Property Unsaved", description: `${property.address} removed from your saved list.` });
    } else {
      addSavedProperty(property.id);
      toast({ title: "Property Saved!", description: `${property.address} added to your saved list.` });
    }
  };

  const timeAgo = property.createdAt ? formatDistanceToNow(new Date(property.createdAt), { addSuffix: true }) : 'recently';

  const submittedByUser = property.submittedBy as UserProfile;

  return (
    // Responsive container padding and spacing
    <div className="container mx-auto px-4 py-4 md:py-8 space-y-6 md:space-y-8">
      {/* Responsive grid with smaller gap on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          <PropertyCarousel 
            images={property.images} 
            altTextPrefix={`Image of ${property.address}`}
            propertyType={property.propertyType as PropertyTypeEnum}
          />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={property.status === 'For Sale' ? 'default' : property.status === 'For Rent' ? 'secondary' : 'outline'} className="text-sm">{property.status}</Badge>
                  {property.isVerified && (
                    <Badge variant="success" className="text-sm flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" /> Verified Listing
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-rose-500 hover:text-rose-600 shrink-0 ml-2"
                  onClick={handleSaveToggle}
                  aria-label={isSaved ? 'Unsave property' : 'Save property'}
                >
                  <Heart size={28} className={isSaved ? "fill-current" : ""} />
                </Button>
              </div>
              {/* Responsive heading */}
              <h1 className="text-2xl sm:text-3xl font-headline font-bold text-primary">{property.address}</h1>
              <p className="text-lg text-muted-foreground flex items-center mt-1">
                <MapPin className="w-5 h-5 mr-2 shrink-0" /> {property.city}
              </p>
              {/* Responsive price */}
              <p className="text-3xl sm:text-4xl font-headline font-bold text-accent mt-2">Rs {property.price.toLocaleString()}</p>
            </CardHeader>
            {/* Responsive grid for info items */}
            <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-base md:text-lg">
              <InfoItem icon={<BedDouble className="text-primary" />} label="Beds" value={String(property.bedrooms)} />
              <InfoItem icon={<Bath className="text-primary" />} label="Baths" value={String(property.bathrooms)} />
              <InfoItem icon={<Maximize className="text-primary" />} label="SqFt" value={property.areaSqFt.toLocaleString()} />
              <InfoItem icon={<Building className="text-primary" />} label="Type" value={property.propertyType} />
              {property.yearBuilt && <InfoItem icon={<CalendarDays className="text-primary" />} label="Built" value={String(property.yearBuilt)} />}
               {property.createdAt && <InfoItem icon={<Tag className="text-primary" />} label="Posted" value={timeAgo} />}
            </CardContent>
          </Card>
           {submittedByUser && (
             <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl">Listed By</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                  <AvatarImage src={submittedByUser.profilePictureUrl || ''} alt={submittedByUser.name} data-ai-hint="person portrait"/>
                  <AvatarFallback>{submittedByUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">{submittedByUser.name}</p>
                  <p className="text-sm text-muted-foreground">Listing Contributor</p>
                </div>
              </CardContent>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full font-headline" variant="outline">
                      <Phone className="w-4 h-4 mr-2" /> Show Contact Information
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Lister Contact Information</DialogTitle>
                      <DialogDescription>
                        Contact details for the person who listed this property.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={submittedByUser.profilePictureUrl || ''} alt={submittedByUser.name} data-ai-hint="person portrait" />
                                <AvatarFallback>{submittedByUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold text-lg">{submittedByUser.name}</p>
                                <p className="text-sm text-muted-foreground">{submittedByUser.role === 'agent' ? 'Verified Agent' : 'Listing Contributor'}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-muted-foreground" />
                                <a href={`mailto:${submittedByUser.email}`} className="text-sm text-foreground hover:underline">{submittedByUser.email}</a>
                            </div>
                            {submittedByUser.phone && (
                                <div className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-muted-foreground" />
                                    <a href={`tel:${submittedByUser.phone}`} className="text-sm text-foreground hover:underline">{submittedByUser.phone}</a>
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button">Close</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
           )}
        </div>
      </div>

      <Separator />

      {/* Responsive grid with smaller gap on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div className="md:col-span-2 space-y-6 md:space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">Property Description</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none text-base">
              <p>{property.description}</p>
            </CardContent>
          </Card>

          {property.features && property.features.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl">Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
                  {property.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
        <div className="md:col-span-1 space-y-6 md:space-y-8">
          
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">Neighborhood Insights</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">Discover more about the neighborhood.</p>
              <Button asChild className="font-headline">
                <Link href={`/insights?location=${encodeURIComponent(property.city)}`}>
                  Get Insights <ExternalLink className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => (
  <div className="flex items-center space-x-2">
    <span className="text-primary">{icon}</span>
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

const SkeletonPropertyPage = () => (
  <div className="space-y-6 md:space-y-8 animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      <div className="lg:col-span-2">
        <Skeleton className="w-full aspect-[16/10] rounded-lg" />
      </div>
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start mb-2">
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" /> 
                <Skeleton className="h-6 w-28" /> 
              </div>
              <Skeleton className="h-8 w-8 rounded-full" /> 
            </div>
            <Skeleton className="h-8 sm:h-10 w-3/4 mb-1" /> 
            <Skeleton className="h-6 w-1/2 mb-2" /> 
            <Skeleton className="h-10 sm:h-12 w-1/2" /> 
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" /> 
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          </CardContent>
           <CardContent>
            <Skeleton className="h-10 w-full mt-2" /> 
          </CardContent>
        </Card>
      </div>
    </div>
    <Separator />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
      <div className="md:col-span-2 space-y-6 md:space-y-8">
        <Card>
          <CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-2">
             {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-4 w-full" />)}
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-1 space-y-6 md:space-y-8">
         <Card>
          <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
          <CardContent className="text-center">
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-10 w-1/2 mx-auto" />
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);
