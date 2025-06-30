
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { MapIcon } from 'lucide-react';

interface MapPlaceholderProps {
  height?: string;
  className?: string;
}

export default function MapPlaceholder({ height = '400px', className }: MapPlaceholderProps) {
  return (
    <Card className={`overflow-hidden shadow-lg ${className}`} style={{ height }}>
      <CardContent className="p-0 h-full flex flex-col items-center justify-center bg-secondary/50">
        <div className="relative w-full h-full">
           <Image
            src="https://placehold.co/800x600.png"
            alt="Map placeholder"
            layout="fill"
            objectFit="cover"
            className="opacity-30"
            data-ai-hint="map city"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10 p-4">
            <MapIcon className="w-16 h-16 text-primary mb-4" />
            <h3 className="text-xl font-semibold text-foreground text-center">Location Not Available</h3>
            <p className="text-muted-foreground text-center mt-2">The exact coordinates for this property have not been provided, or the map service is unavailable.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
