
"use client";

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';
import { Skeleton } from '@/components/ui/skeleton';

interface LocationPickerMapProps {
  onLocationChange: (lat: number, lng: number) => void;
  initialPosition?: { lat: number; lng: number };
}

const defaultCenter: [number, number] = [33.6844, 73.0479]; // Islamabad

function LocationMarker({ onLocationChange, initialPosition }: LocationPickerMapProps) {
  const [position, setPosition] = useState<[number, number] | null>(
    initialPosition ? [initialPosition.lat, initialPosition.lng] : defaultCenter
  );
  const markerRef = useRef<any>(null);

  const map = useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
    locationfound(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      map.flyTo(e.latlng, map.getZoom());
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });

  useEffect(() => {
    if (initialPosition) {
        const newPos: [number, number] = [initialPosition.lat, initialPosition.lng];
        setPosition(newPos);
        map.flyTo(newPos, 15);
    } else {
        // Silently try to get location, but don't prompt user.
        // map.locate();
    }
  }, [initialPosition, map]);


  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const latLng = marker.getLatLng();
          setPosition([latLng.lat, latLng.lng]);
          onLocationChange(latLng.lat, latLng.lng);
        }
      },
    }),
    [onLocationChange]
  );

  return position === null ? null : (
    <Marker position={position} draggable={true} eventHandlers={eventHandlers} ref={markerRef} />
  );
}

// ChangeView component to update map view when position changes
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMapEvents({});
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

const LocationPickerMap: React.FC<LocationPickerMapProps> = ({ onLocationChange, initialPosition }) => {
  // To avoid SSR issues with Leaflet
  if (typeof window === 'undefined') {
    return <Skeleton className="w-full h-[400px]" />;
  }

  const center: [number, number] = initialPosition ? [initialPosition.lat, initialPosition.lng] : defaultCenter;
  const zoom = initialPosition ? 15 : 10;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      style={{ height: '400px', width: '100%' }}
      className="rounded-md"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker onLocationChange={onLocationChange} initialPosition={initialPosition} />
      {initialPosition && <ChangeView center={[initialPosition.lat, initialPosition.lng]} zoom={15} />}
    </MapContainer>
  );
};

export default LocationPickerMap;
