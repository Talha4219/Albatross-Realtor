"use client";

import * as React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { PropertyTypeEnum } from "@/types";

interface PropertyCarouselProps {
  images: string[];
  altTextPrefix: string;
  propertyType?: PropertyTypeEnum;
}

const DEFAULT_PLACEHOLDER_IMAGE_CAROUSEL = 'https://placehold.co/800x500.png';

const isValidImageUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  // Allow data URIs for uploaded images and common image hosts
  if (url.startsWith('data:image')) {
    return true;
  }
  try {
    const validHostnames = ['images.unsplash.com', 'placehold.co'];
    const parsedUrl = new URL(url);
    return validHostnames.includes(parsedUrl.hostname);
  } catch (e) {
    // URL parsing failed, so it's not a valid URL.
    return false;
  }
};

export function PropertyCarousel({ images, altTextPrefix, propertyType }: PropertyCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const processedImages = React.useMemo(() => {
    if (!images || images.length === 0) {
      return [DEFAULT_PLACEHOLDER_IMAGE_CAROUSEL];
    }
    // Update the mapping to use the more permissive isValidImageUrl function
    return images.map(src => isValidImageUrl(src) ? src : DEFAULT_PLACEHOLDER_IMAGE_CAROUSEL);
  }, [images]);

  if (processedImages.length === 0) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="flex aspect-video items-center justify-center p-6 bg-muted">
          <Image 
            src={DEFAULT_PLACEHOLDER_IMAGE_CAROUSEL}
            alt="Placeholder image" 
            width={800} 
            height={500} 
            className="object-cover w-full h-full"
            data-ai-hint="property photo"
          />
        </CardContent>
      </Card>
    );
  }
  
  const getHintForImage = (index: number): string => {
    if (index === 0) { // First image is likely exterior
      if (propertyType) {
        const typeLower = propertyType.toLowerCase();
        if (typeLower === 'house') return "house exterior";
        if (typeLower === 'apartment') return "apartment building";
        if (typeLower === 'condo') return "condo building";
        if (typeLower === 'townhouse') return "townhouse exterior";
        if (typeLower === 'land') return "land plot";
      }
      return "property exterior";
    }
    // Subsequent images are more likely interior or detail shots
    if (propertyType) {
      const typeLower = propertyType.toLowerCase();
      if (typeLower === 'house') return "house interior";
      if (typeLower === 'apartment') return "apartment room";
      if (typeLower === 'condo') return "condo interior";
      if (typeLower === 'townhouse') return "townhouse room";
    }
    return "room view"; // Generic hint for other images
  };

  return (
    <div className="relative">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {processedImages.map((src, index) => (
            <CarouselItem key={index}>
              <Card className="overflow-hidden shadow-none border-none rounded-lg">
                <CardContent className="flex aspect-[16/10] items-center justify-center p-0">
                  <Image
                    src={src}
                    alt={`${altTextPrefix} - Image ${index + 1}`}
                    width={800}
                    height={500}
                    className="object-cover w-full h-full"
                    priority={index === 0} 
                    data-ai-hint={getHintForImage(index)}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; 
                        target.src = DEFAULT_PLACEHOLDER_IMAGE_CAROUSEL;
                      }}
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        {processedImages.length > 1 && (
          <>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-background/70 hover:bg-background text-foreground" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-background/70 hover:bg-background text-foreground" />
          </>
        )}
      </Carousel>
      {processedImages.length > 1 && (
        <div className="py-2 text-center text-sm text-muted-foreground absolute bottom-2 left-1/2 -translate-x-1/2 bg-background/70 px-3 py-1 rounded-full">
          Image {current} of {count}
        </div>
      )}
    </div>
  );
}