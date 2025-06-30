"use client";

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';

interface LocationPickerMapProps {
  onLocationChange: (lat: number, lng: number) => void;
  initialPosition?: { lat: number; lng: number };
}

const defaultCenter: [number, number] = [33.6844, 73.0479]; // Islamabad

function LocationMarker({ onLocationChange, initialPosition }: LocationPickerMapProps) {
  const [position, setPosition] = useState<[number, number]>(
    initialPosition ? [initialPosition.lat, initialPosition.lng] : defaultCenter
  );
  const markerRef = useRef<LeafletMarker | null>(null);
  const map = useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
    locationfound(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      map.flyTo(e.latlng, 15);
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });

  useEffect(() => {
    if (initialPosition) {
      const newPos: [number, number] = [initialPosition.lat, initialPosition.lng];
      setPosition(newPos);
      map.flyTo(newPos, 15);
    }
  }, [initialPosition, map]);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker) {
          const latLng = marker.getLatLng();
          setPosition([latLng.lat, latLng.lng]);
          onLocationChange(latLng.lat, latLng.lng);
        }
      },
    }),
    [onLocationChange]
  );

  return <Marker position={position} draggable={true} eventHandlers={eventHandlers} ref={markerRef} />;
}

// Dynamic import to prevent SSR issues
const MapContainerDynamic = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[400px]" />,
});

const LocationPickerMap: React.FC<LocationPickerMapProps> = ({ onLocationChange, initialPosition }) => {
  const mapRef = useRef<LeafletMap | null>(null);
  const center = useMemo(() => initialPosition ? [initialPosition.lat, initialPosition.lng] : defaultCenter, [initialPosition]);
  const zoom = initialPosition ? 15 : 10;

  // Cleanup map instance on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <MapContainerDynamic
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      style={{ height: '400px', width: '100%' }}
      className="rounded-md"
      whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
      aria-label="Interactive map for selecting property location"
    >
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker onLocationChange={onLocationChange} initialPosition={initialPosition} />
    </MapContainerDynamic>
  );
};

export default LocationPickerMap;