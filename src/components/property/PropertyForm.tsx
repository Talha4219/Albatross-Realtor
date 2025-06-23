
"use client";

import React, { useState, useEffect } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { PropertyTypeEnum as PropertyTypeType, PropertyStatusEnum } from '@/types'; // Renamed to avoid conflict
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';

const propertyTypes: PropertyTypeType[] = ['House', 'Apartment', 'Condo', 'Townhouse', 'Land'];
// These are statuses a user can set when creating/editing. Admin might have more options for 'status' via other interfaces.
const userSettablePropertyStatuses: PropertyStatusEnum[] = ['For Sale', 'For Rent', 'Draft']; 


const PropertyFormSchema = z.object({
  address: z.string().min(5, "Address must be at least 5 characters."),
  city: z.string().min(2, "City must be at least 2 characters."),
  state: z.string().min(2, "State must be at least 2 characters."),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format."),
  price: z.coerce.number().positive("Price must be a positive number."),
  bedrooms: z.coerce.number().int().min(0, "Bedrooms must be 0 or more."),
  bathrooms: z.coerce.number().min(0, "Bathrooms must be 0 or more."),
  areaSqFt: z.coerce.number().positive("Area must be a positive number."),
  description: z.string().min(20, "Description must be at least 20 characters."),
  propertyType: z.enum(propertyTypes),
  status: z.enum(userSettablePropertyStatuses), // Use user-settable statuses for the form
  yearBuilt: z.coerce.number().optional().nullable().refine(val => val === null || val === undefined || (val >= 1800 && val <= new Date().getFullYear() + 5), {
    message: `Year built must be between 1800 and ${new Date().getFullYear() + 5}. Leave empty if not applicable.`
  }),
  images: z.array(z.string().url("Must be a valid URL.").min(1, "Image URL cannot be empty.")).min(1, "At least one image URL is required."),
  features: z.array(z.string().min(1, "Feature cannot be empty.")).optional(),
});

export type PropertyFormData = z.infer<typeof PropertyFormSchema>;

interface PropertyFormProps {
  onSubmit: SubmitHandler<PropertyFormData>;
  initialData?: Partial<PropertyFormData>;
  isLoading?: boolean;
  formType?: 'create' | 'edit';
}

export default function PropertyForm({ onSubmit, initialData, isLoading, formType = 'create' }: PropertyFormProps) {
  const form = useForm<PropertyFormData>({
    resolver: zodResolver(PropertyFormSchema),
    defaultValues: {
      address: '',
      city: '',
      state: '',
      zip: '',
      price: 0,
      bedrooms: 0,
      bathrooms: 0,
      areaSqFt: 0,
      description: '',
      propertyType: 'House',
      status: 'For Sale', // Default to 'For Sale' for new submissions
      yearBuilt: null,
      images: [''],
      features: [''],
      ...initialData, // Spread initialData here to override defaults if provided
    },
  });
  
  // Effect to reset form when initialData changes (e.g., when navigating between edit pages or data loads)
  useEffect(() => {
    if (initialData) {
      // Filter out undefined values from initialData to prevent controlled/uncontrolled input issues
      const filteredInitialData = Object.entries(initialData).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          (acc as any)[key] = value;
        }
        return acc;
      }, {} as Partial<PropertyFormData>);
      
      form.reset({
        address: '', city: '', state: '', zip: '', price: 0, bedrooms: 0, bathrooms: 0, areaSqFt: 0,
        description: '', propertyType: 'House', status: 'For Sale', yearBuilt: null,
        images: [''], features: [''],
        ...filteredInitialData // Spread the potentially modified initialData
      });
      // Also update local state for dynamic fields if they are derived from initialData
      setImageFields(initialData.images && initialData.images.length > 0 ? initialData.images : ['']);
      setFeatureFields(initialData.features && initialData.features.length > 0 ? initialData.features : ['']);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, form.reset]);


  const [imageFields, setImageFields] = useState<string[]>(initialData?.images && initialData.images.length > 0 ? initialData.images : ['']);
  const [featureFields, setFeatureFields] = useState<string[]>(initialData?.features && initialData.features.length > 0 ? initialData.features : ['']);

  const addImageField = () => {
    const newImages = [...imageFields, ''];
    setImageFields(newImages);
    form.setValue('images', newImages.filter(img => img?.trim() !== ''));
  };
  const removeImageField = (index: number) => {
    const newImages = imageFields.filter((_, i) => i !== index);
    setImageFields(newImages.length > 0 ? newImages : ['']); 
    form.setValue('images', newImages.filter(img => img?.trim() !== ''));
  };
  const handleImageChange = (index: number, value: string) => {
    const newImages = [...imageFields];
    newImages[index] = value;
    setImageFields(newImages);
    form.setValue('images', newImages.filter(img => img?.trim() !== ''));
  };

  const addFeatureField = () => {
    const newFeatures = [...featureFields, ''];
    setFeatureFields(newFeatures);
    form.setValue('features', newFeatures.filter(feat => feat?.trim() !== ''));
  };
  const removeFeatureField = (index: number) => {
    const newFeatures = featureFields.filter((_, i) => i !== index);
    setFeatureFields(newFeatures.length > 0 ? newFeatures : ['']);
    form.setValue('features', newFeatures.filter(feat => feat?.trim() !== ''));
  };
  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...featureFields];
    newFeatures[index] = value;
    setFeatureFields(newFeatures);
    form.setValue('features', newFeatures.filter(feat => feat?.trim() !== ''));
  };


  const processSubmit: SubmitHandler<PropertyFormData> = (data) => {
    const processedData = {
      ...data,
      images: data.images.filter(img => img?.trim() !== ''),
      features: data.features?.filter(feat => feat?.trim() !== '') || [],
      yearBuilt: data.yearBuilt ? Number(data.yearBuilt) : null,
    };
    onSubmit(processedData);
  };

  const submitButtonText = formType === 'edit' ? 'Update Property' : 'Submit Property for Approval';


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(processSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl><Input placeholder="e.g., 123 Main St" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl><Input placeholder="e.g., Pleasantville" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl><Input placeholder="e.g., CA" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="zip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ZIP Code</FormLabel>
                <FormControl><Input placeholder="e.g., 90210" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl><Input type="number" placeholder="e.g., 750000" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bedrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bedrooms</FormLabel>
                <FormControl><Input type="number" placeholder="e.g., 3" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bathrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bathrooms</FormLabel>
                <FormControl><Input type="number" step="0.5" placeholder="e.g., 2.5" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="areaSqFt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Area (sq ft)</FormLabel>
                <FormControl><Input type="number" placeholder="e.g., 1800" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="yearBuilt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year Built (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="e.g., 1985" 
                    {...field} 
                    value={field.value === null || field.value === undefined ? '' : String(field.value)}
                    onChange={e => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl><Textarea placeholder="Describe the property..." {...field} rows={5} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="propertyType"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Property Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue={initialData?.propertyType || 'House'}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select property type" /></SelectTrigger></FormControl>
                    <SelectContent>
                    {propertyTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Listing Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue={initialData?.status || 'For Sale'}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select listing status" /></SelectTrigger></FormControl>
                    <SelectContent>
                    {userSettablePropertyStatuses.map(status => ( // Use userSettablePropertyStatuses
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
          control={form.control}
          name="images"
          render={() => ( 
            <FormItem>
              <FormLabel>Image URLs (at least one required)</FormLabel>
              {imageFields.map((imageUrl, index) => (
                <div key={index} className="flex items-center gap-2">
                  <FormControl>
                    <Input
                      placeholder={`Image URL ${index + 1} (e.g., https://placehold.co/600x400.png)`}
                      value={imageUrl || ''} // Ensure value is not null for input
                      onChange={(e) => handleImageChange(index, e.target.value)}
                    />
                  </FormControl>
                  {imageFields.length > 1 && (
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeImageField(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addImageField}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Image URL
              </Button>
              <FormMessage>{form.formState.errors.images?.message || form.formState.errors.images?.[0]?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="features"
          render={() => (
            <FormItem>
              <FormLabel>Features (Optional, one per line)</FormLabel>
              {featureFields.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <FormControl>
                    <Input
                      placeholder={`Feature ${index + 1} (e.g., Granite Countertops)`}
                      value={feature || ''} // Ensure value is not null for input
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                    />
                  </FormControl>
                  {featureFields.length > 1 || (featureFields.length === 1 && featureFields[0] !== '') ? (
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeFeatureField(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  ) : null}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addFeatureField}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Feature
              </Button>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full font-headline text-lg py-3" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
          {submitButtonText}
        </Button>
      </form>
    </Form>
  );
}
