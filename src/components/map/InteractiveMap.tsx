
"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';
import React from 'react';
import type { Property } from '@/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

interface InteractiveMapProps {
  properties: Property[];
  className?: string;
}

const defaultCenter: [number, number] = [33.6844, 73.0479]; // Islamabad

const InteractiveMap = ({ properties, className }: InteractiveMapProps) => {
  const propertiesWithCoords = properties.filter(
    (p) => p.latitude !== undefined && p.longitude !== undefined
  );

  const mapCenter: [number, number] = propertiesWithCoords.length === 1 
    ? [propertiesWithCoords[0].latitude!, propertiesWithCoords[0].longitude!]
    : defaultCenter;

  const mapZoom = propertiesWithCoords.length === 1 ? 15 : propertiesWithCoords.length > 1 ? 12 : 10;
  
  // Prevents map from rendering on server
  if (typeof window === 'undefined') {
    return <div className={cn("bg-muted animate-pulse", className)}></div>;
  }

  return (
    <div className={cn("h-full w-full", className)}>
      <MapContainer center={mapCenter} zoom={mapZoom} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {propertiesWithCoords.map((property) => (
          <Marker key={property.id} position={[property.latitude!, property.longitude!]}>
            <Popup>
               <div className="w-48">
                  <Image 
                    src={property.images[0] || 'https://placehold.co/200x150.png'}
                    alt={property.address}
                    width={200}
                    height={150}
                    className="rounded-md object-cover mb-2"
                    data-ai-hint="property exterior"
                  />
                  <h4 className="font-bold text-md line-clamp-2 text-foreground">{property.address}</h4>
                  <p className="text-primary font-bold">Rs {property.price.toLocaleString()}</p>
                  <Link href={`/property/${property.id}`} className="text-primary hover:underline text-sm font-semibold">
                    View Details
                  </Link>
                </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;
