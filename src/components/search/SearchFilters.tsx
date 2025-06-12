
"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { SearchIcon, HomeIcon, BedIcon, BathIcon, DollarSignIcon, ScanSearch } from 'lucide-react';
import type { PropertyType } from '@/types';

interface SearchFiltersProps {
  onSearch: (filters: any) => void; // Define a proper filter type later
}

const propertyTypes: PropertyType[] = ['House', 'Apartment', 'Condo', 'Townhouse', 'Land'];
const bedOptions = [1, 2, 3, 4, 5];
const bathOptions = [1, 1.5, 2, 2.5, 3, 4];

export default function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([50000, 5000000]);
  const [propertyType, setPropertyType] = useState<PropertyType | ''>('');
  const [beds, setBeds] = useState<number | ''>('');
  const [baths, setBaths] = useState<number | ''>('');
  const [minArea, setMinArea] = useState<string>('');
  const [maxArea, setMaxArea] = useState<string>('');
  const [isFurnished, setIsFurnished] = useState(false);
  const [hasPool, setHasPool] = useState(false);


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      location,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      propertyType,
      beds,
      baths,
      minArea: minArea ? parseInt(minArea) : undefined,
      maxArea: maxArea ? parseInt(maxArea) : undefined,
      isFurnished,
      hasPool,
    });
  };

  return (
    <Card className="mb-8 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center gap-2">
          <ScanSearch className="w-7 h-7 text-primary" />
          Find Your Dream Property
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
          <div className="lg:col-span-4">
            <Label htmlFor="location" className="font-medium mb-1 block">Location</Label>
            <Input
              id="location"
              type="text"
              placeholder="City, State, Zip, or Address"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="text-base"
            />
          </div>

          <div className="lg:col-span-4">
            <Label className="font-medium mb-2 block">Price Range</Label>
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>${priceRange[0].toLocaleString()}</span>
              <span>${priceRange[1].toLocaleString()}</span>
            </div>
            <Slider
              min={0}
              max={5000000}
              step={10000}
              value={[priceRange[0], priceRange[1]]}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              className="my-2"
            />
          </div>
          
          <div>
            <Label htmlFor="propertyType" className="font-medium mb-1 block">Property Type</Label>
            <Select value={propertyType} onValueChange={(value) => setPropertyType(value as PropertyType)}>
              <SelectTrigger id="propertyType" className="w-full">
                <SelectValue placeholder="Any Type" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="beds" className="font-medium mb-1 block">Beds</Label>
            <Select value={beds === '' ? '' : String(beds)} onValueChange={(value) => setBeds(value === '' ? '' : Number(value))}>
              <SelectTrigger id="beds" className="w-full">
                <SelectValue placeholder="Any Beds" />
              </SelectTrigger>
              <SelectContent>
                {bedOptions.map(option => (
                  <SelectItem key={option} value={String(option)}>{option}{option === 5 ? '+' : ''} Beds</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="baths" className="font-medium mb-1 block">Baths</Label>
            <Select value={baths === '' ? '' : String(baths)} onValueChange={(value) => setBaths(value === '' ? '' : Number(value))}>
              <SelectTrigger id="baths" className="w-full">
                <SelectValue placeholder="Any Baths" />
              </SelectTrigger>
              <SelectContent>
                {bathOptions.map(option => (
                  <SelectItem key={option} value={String(option)}>{option}{option === 4 ? '+' : ''} Baths</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end space-x-2">
            <div>
              <Label htmlFor="minArea" className="font-medium mb-1 block">Min Area (sqft)</Label>
              <Input id="minArea" type="number" placeholder="e.g. 1000" value={minArea} onChange={e => setMinArea(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="maxArea" className="font-medium mb-1 block">Max Area (sqft)</Label>
              <Input id="maxArea" type="number" placeholder="e.g. 3000" value={maxArea} onChange={e => setMaxArea(e.target.value)} />
            </div>
          </div>
          
          <div className="lg:col-span-4 mt-4 space-y-3">
            <Label className="font-medium block">Features</Label>
            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                    <Checkbox id="furnished" checked={isFurnished} onCheckedChange={(checked) => setIsFurnished(checked as boolean)} />
                    <Label htmlFor="furnished" className="font-normal text-sm">Furnished</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="pool" checked={hasPool} onCheckedChange={(checked) => setHasPool(checked as boolean)} />
                    <Label htmlFor="pool" className="font-normal text-sm">Pool</Label>
                </div>
            </div>
          </div>


          <div className="lg:col-span-4 flex justify-end mt-4">
            <Button type="submit" size="lg" className="w-full lg:w-auto font-headline">
              <SearchIcon className="mr-2 h-5 w-5" />
              Search Properties
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
