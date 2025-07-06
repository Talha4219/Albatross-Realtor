
"use client";

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchIcon, ScanSearch } from 'lucide-react';
import type { PropertyTypeEnum } from '@/types';

export interface SearchFilterValues {
  q: string;
  propertyType: string;
  status: string;
  minPrice: string;
  maxPrice: string;
  beds: string;
  baths: string;
}

interface SearchFiltersProps {
  onSearch: (filters: SearchFilterValues) => void;
  initialFilters?: Partial<SearchFilterValues>;
  isLoading?: boolean;
}

const propertyTypes: PropertyTypeEnum[] = [
    'House', 'Apartment', 'Condo', 'Townhouse', 'Land', 'Plot', 
    'Flat', 'Upper Portion', 'Lower Portion', 'Farm House', 'Room', 'Penthouse',
    'Residential Plot', 'Commercial Plot', 'Agricultural Land', 'Industrial Land', 'Plot File', 'Plot Form',
    'Office', 'Shop', 'Warehouse', 'Factory', 'Building', 'Other'
];
const bedOptions = [1, 2, 3, 4, 5];
const bathOptions = [1, 2, 3, 4];

export default function SearchFilters({ onSearch, initialFilters, isLoading }: SearchFiltersProps) {
  const [filters, setFilters] = useState<SearchFilterValues>({
    q: '',
    propertyType: '',
    status: '',
    minPrice: '',
    maxPrice: '',
    beds: '',
    baths: '',
    ...initialFilters,
  });

  useEffect(() => {
    setFilters(prev => ({ ...prev, ...initialFilters }));
  }, [initialFilters]);

  const handleInputChange = (key: keyof SearchFilterValues, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <Card className="mb-8 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center gap-2">
          <ScanSearch className="w-7 h-7 text-primary" />
          Filter Properties
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
          <div className="lg:col-span-2">
            <Label htmlFor="q">Location / Keyword</Label>
            <Input
              id="q"
              placeholder="City, Area (e.g., Bahria Town), or Address"
              value={filters.q}
              onChange={(e) => handleInputChange('q', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="status">Listing Status</Label>
            <Select value={filters.status} onValueChange={(value) => handleInputChange('status', value)}>
              <SelectTrigger id="status"><SelectValue placeholder="For Sale / Rent" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Status</SelectItem>
                <SelectItem value="For Sale">For Sale</SelectItem>
                <SelectItem value="For Rent">For Rent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="propertyType">Property Type</Label>
            <Select value={filters.propertyType} onValueChange={(value) => handleInputChange('propertyType', value)}>
              <SelectTrigger id="propertyType"><SelectValue placeholder="Any Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Type</SelectItem>
                {propertyTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="beds">Min. Beds</Label>
            <Select value={filters.beds} onValueChange={(value) => handleInputChange('beds', value)}>
              <SelectTrigger id="beds"><SelectValue placeholder="Any Beds" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any</SelectItem>
                {bedOptions.map(o => <SelectItem key={o} value={String(o)}>{o}{o === 5 ? '+' : ''}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="baths">Min. Baths</Label>
            <Select value={filters.baths} onValueChange={(value) => handleInputChange('baths', value)}>
              <SelectTrigger id="baths"><SelectValue placeholder="Any Baths" /></SelectTrigger>
              <SelectContent>
                 <SelectItem value="">Any</SelectItem>
                {bathOptions.map(o => <SelectItem key={o} value={String(o)}>{o}{o === 4 ? '+' : ''}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="lg:col-span-2 grid grid-cols-2 gap-2">
            <div>
                <Label htmlFor="minPrice">Min. Price (PKR)</Label>
                <Input id="minPrice" type="number" placeholder="e.g., 5000000" value={filters.minPrice} onChange={(e) => handleInputChange('minPrice', e.target.value)} />
            </div>
             <div>
                <Label htmlFor="maxPrice">Max. Price (PKR)</Label>
                <Input id="maxPrice" type="number" placeholder="e.g., 20000000" value={filters.maxPrice} onChange={(e) => handleInputChange('maxPrice', e.target.value)} />
            </div>
          </div>
          <div className="lg:col-span-4 flex justify-end mt-4">
            <Button type="submit" size="lg" className="w-full lg:w-auto font-headline" disabled={isLoading}>
              <SearchIcon className="mr-2 h-5 w-5" />
              Search
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
