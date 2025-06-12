"use client";

import type { Property } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockProperties } from '@/lib/mock-data'; // Assuming mockProperties is the source

interface SavedPropertiesContextType {
  savedPropertyIds: string[];
  savedProperties: Property[];
  addSavedProperty: (propertyId: string) => void;
  removeSavedProperty: (propertyId: string) => void;
  isPropertySaved: (propertyId: string) => boolean;
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedPropertyIds));
      // Filter full property objects based on saved IDs
      const filteredProperties = mockProperties.filter(property => savedPropertyIds.includes(property.id));
      setSavedProperties(filteredProperties);
    }
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
    <SavedPropertiesContext.Provider value={{ savedPropertyIds, savedProperties, addSavedProperty, removeSavedProperty, isPropertySaved }}>
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
