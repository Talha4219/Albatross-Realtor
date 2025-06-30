"use client";

import type { Property } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SavedPropertiesContextType {
  savedPropertyIds: string[];
  savedProperties: Property[];
  addSavedProperty: (propertyId: string) => void;
  removeSavedProperty: (propertyId: string) => void;
  isPropertySaved: (propertyId: string) => boolean;
  isLoading: boolean;
}

const SavedPropertiesContext = createContext<SavedPropertiesContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'savedPropertiesEstateExplore';

export const SavedPropertiesProvider = ({ children }: { children: ReactNode }) => {
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSavedProperties = async () => {
      if (savedPropertyIds.length === 0) {
        setSavedProperties([]);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const propertiesData = await Promise.all(
          savedPropertyIds.map(id => 
            fetch(`/api/properties/${id}`).then(res => {
              if (res.ok) return res.json();
              // If a property is not found (404) or another error, return null
              console.warn(`Could not fetch saved property with ID ${id}. It may have been removed.`);
              return null; 
            })
          )
        );
        // Filter out nulls and only take successful property data
        const validProperties = propertiesData
          .filter(p => p && p.success)
          .map(p => p.data);

        setSavedProperties(validProperties);
      } catch (error) {
        console.error("Error fetching saved properties details:", error);
        setSavedProperties([]); // Clear properties on error
      } finally {
        setIsLoading(false);
      }
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedPropertyIds));
      fetchSavedProperties();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedPropertyIds]);


  const addSavedProperty = (propertyId: string) => {
    setSavedPropertyIds((prev) => {
      if (!prev.includes(propertyId)) {
        return [...prev, propertyId];
      }
      return prev;
    });
  };

  const removeSavedProperty = (propertyId: string) => {
    setSavedPropertyIds((prev) => prev.filter((id) => id !== propertyId));
  };

  const isPropertySaved = (propertyId: string) => {
    return savedPropertyIds.includes(propertyId);
  };

  return (
    <SavedPropertiesContext.Provider value={{ savedPropertyIds, savedProperties, addSavedProperty, removeSavedProperty, isPropertySaved, isLoading }}>
      {children}
    </SavedPropertiesContext.Provider>
  );
};

export const useSavedProperties = () => {
  const context = useContext(SavedPropertiesContext);
  if (context === undefined) {
    throw new Error('useSavedProperties must be used within a SavedPropertiesProvider');
  }
  return context;
};
