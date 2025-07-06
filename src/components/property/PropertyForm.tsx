
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { PropertyTypeEnum as PropertyTypeType, PropertyStatusEnum } from '@/types';
import { Loader2, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const propertyTypes: PropertyTypeType[] = [
    'House', 'Apartment', 'Condo', 'Townhouse', 'Land', 'Plot', 
    'Flat', 'Upper Portion', 'Lower Portion', 'Farm House', 'Room', 'Penthouse',
    'Residential Plot', 'Commercial Plot', 'Agricultural Land', 'Industrial Land', 'Plot File', 'Plot Form',
    'Office', 'Shop', 'Warehouse', 'Factory', 'Building', 'Other'
];
const userSettablePropertyStatuses: PropertyStatusEnum[] = ['For Sale', 'For Rent', 'Draft']; 

const PropertyFormSchema = z.object({
  address: z.string().min(5, "Address must be at least 5 characters."),
  city: z.string().min(2, "City must be at least 2 characters."),
  price: z.coerce.number({ required_error: "Price is required." }).min(1, "Price must be at least PKR 1."),
  bedrooms: z.coerce.number().int().min(0, "Bedrooms must be 0 or more."),
  bathrooms: z.coerce.number().min(0, "Bathrooms must be 0 or more."),
  areaSqFt: z.coerce.number({ required_error: "Area is required." }).min(1, "Area must be at least 1."),
  description: z.string().min(20, "Description must be at least 20 characters."),
  propertyType: z.enum(propertyTypes),
  status: z.enum(userSettablePropertyStatuses), 
  yearBuilt: z.coerce.number().optional().nullable().refine(val => val === null || val === undefined || (val >= 1800 && val <= new Date().getFullYear() + 5), {
    message: `Year built must be between 1800 and ${new Date().getFullYear() + 5}. Leave empty if not applicable.`
  }),
  images: z.array(z.string().min(1, "Image data cannot be empty.")).min(1, "At least one image is required."),
  features: z.array(z.string()).optional(),
}).refine(data => {
    if (['Plot', 'Land', 'Residential Plot', 'Commercial Plot', 'Agricultural Land', 'Industrial Land', 'Plot File', 'Plot Form'].includes(data.propertyType)) {
        return data.bedrooms === 0 && data.bathrooms === 0;
    }
    return true;
}, {
    message: "Bedrooms and bathrooms must be 0 for a Plot or Land.",
    path: ["bedrooms"],
});


export type PropertyFormData = z.infer<typeof PropertyFormSchema>;

interface PropertyFormProps {
  onSubmit: SubmitHandler<PropertyFormData>;
  initialData?: Partial<PropertyFormData>;
  isLoading?: boolean;
  formType?: 'create' | 'edit';
}

const featureCategories = [
  {
    title: "Location-Based Features",
    features: [
      "Corner Plot", "Main Boulevard Facing", "Sun Facing (East/West)", "Park Facing", "Facing Open Area / Green Belt",
      "Backside/Internal Plot", "Cul-de-Sac / Dead-End Plot", "Opposite Commercial Area", "Facing Mosque / Temple / Church",
      "Near School / Hospital / Community Center", "Near Society Entrance or Gate", "Adjacent to Playground or Sports Complex",
    ]
  },
  {
    title: "Shape and Orientation Features",
    features: [
      "Regular-Shaped Plot", "Irregular / Odd-Shaped Plot", "Wide Frontage", "Corner Cut or Chamfered Edge", "North-East Corner / Vastu Compliant",
    ]
  },
  {
    title: "Size and Dimensions",
    features: [ "Standard Size Plot", "Oversized or Extra Land", "Under-Sized or Odd Cut Plot", ]
  },
  {
    title: "Accessibility and Utility Features",
    features: [ "Double Road Access", "Paved Road Access", "Ready for Possession", "Developed Area", "Undeveloped Area / Future Potential", ]
  },
  {
    title: "Surrounding and Environmental Features",
    features: [ "Lake Facing / River Facing / Waterfront", "Hill or Mountain Facing", "Quiet Zone / Low Traffic Area", "Wind Direction / Natural Airflow", "Good Soil Condition", "Flood-Free Area", ]
  },
  {
    title: "Financial/Legal Features",
    features: [ "Registry / Lease Hold / Freehold Plot", "Clear Title / NOC Approved", "Possession Available", "Balloted / Non-Balloted", "Installment Plan Available", "Corner + Park + Boulevard Combo Plot", ]
  },
  {
    title: "Construction and Utility Readiness",
    features: [ "Level Plot", "Filling Required", "Utilities Available (Water, Gas, etc.)", "Under Smart Infrastructure Plan", ]
  }
];

export default function PropertyForm({ onSubmit, initialData, isLoading, formType = 'create' }: PropertyFormProps) {
  const defaultValues = useMemo(() => ({
    address: '', city: '', price: undefined, bedrooms: 0, bathrooms: 0, areaSqFt: undefined, description: '', 
    propertyType: 'House', status: 'For Sale' as const, yearBuilt: null, images: [], features: [],
    ...initialData,
  }), [initialData]);

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(PropertyFormSchema),
    defaultValues, 
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>(initialData?.images || []);
  const [displayPrice, setDisplayPrice] = useState(initialData?.price?.toLocaleString('en-PK') || "");

  const currentPropertyType = form.watch('propertyType');
  const plotTypes: PropertyTypeType[] = ['Plot', 'Land', 'Residential Plot', 'Commercial Plot', 'Agricultural Land', 'Industrial Land', 'Plot File', 'Plot Form'];
  const isPlotOrLand = plotTypes.includes(currentPropertyType);

  useEffect(() => {
    form.reset(defaultValues);
    setImagePreviews(defaultValues.images || []);
    setDisplayPrice(defaultValues.price?.toLocaleString('en-PK') || "");
  }, [defaultValues, form]);


  useEffect(() => {
    if (isPlotOrLand) {
      form.setValue('bedrooms', 0);
      form.setValue('bathrooms', 0);
    }
  }, [currentPropertyType, form, isPlotOrLand]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const currentFiles = form.getValues('images') || [];
    const newFilePromises = Array.from(files).map(file => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    });

    Promise.all(newFilePromises).then(newBase64Files => {
        const updatedFiles = [...currentFiles, ...newBase64Files];
        setImagePreviews(updatedFiles);
        form.setValue('images', updatedFiles, { shouldValidate: true, shouldDirty: true });
    });
  };

  const removeImage = (index: number) => {
      const currentImages = form.getValues('images') || [];
      const updatedImages = [...currentImages];
      updatedImages.splice(index, 1);
      setImagePreviews(updatedImages);
      form.setValue('images', updatedImages, { shouldValidate: true, shouldDirty: true });
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''), 10);

    if (isNaN(numericValue)) {
      setDisplayPrice('');
      form.setValue('price', undefined as any, { shouldValidate: true });
    } else {
      setDisplayPrice(numericValue.toLocaleString('en-PK'));
      form.setValue('price', numericValue, { shouldValidate: true });
    }
  };


  const submitButtonText = formType === 'edit' ? 'Update Property' : 'Submit Property';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl><Input placeholder="e.g., House 123, Street 4, Sector F-10/2, Islamabad" {...field} /></FormControl>
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
                <FormControl><Input placeholder="e.g., Islamabad" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (PKR)</FormLabel>
                <FormControl>
                    <Input 
                        type="text" 
                        inputMode="numeric"
                        placeholder="e.g., 25,000,000" 
                        value={displayPrice}
                        onChange={handlePriceChange}
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="areaSqFt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Area (Sq. Ft.)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="e.g., 2722"
                    {...field}
                    onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!isPlotOrLand && (
              <>
                <FormField
                    control={form.control}
                    name="bedrooms"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Bedrooms</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 3" {...field} onChange={e => field.onChange(Number(e.target.value))} disabled={isPlotOrLand} /></FormControl>
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
                        <FormControl><Input type="number" step="0.5" placeholder="e.g., 2" {...field} onChange={e => field.onChange(Number(e.target.value))} disabled={isPlotOrLand} /></FormControl>
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
                            placeholder="e.g., 2015" 
                            {...field} 
                            value={field.value === null || field.value === undefined ? '' : String(field.value)}
                            onChange={e => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                            disabled={isPlotOrLand}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </>
          )}
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
        
        {formType === 'edit' && (
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Listing Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue={initialData?.status || 'For Sale'}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select listing status" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {userSettablePropertyStatuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}


        <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Property Images</FormLabel>
                <FormControl>
                    <Input
                    type="file"
                    multiple
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                </FormControl>
                <FormMessage />
                {imagePreviews.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {imagePreviews.map((src, index) => (
                        <div key={index} className="relative group">
                        <Image
                            src={src}
                            alt={`Preview ${index + 1}`}
                            width={150}
                            height={150}
                            className="rounded-md object-cover aspect-square w-full h-full"
                        />
                         <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                        </div>
                    ))}
                    </div>
                )}
                </FormItem>
            )}
        />

        <FormField
          control={form.control}
          name="features"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">Property Features</FormLabel>
              <FormDescription>
                Select all the features that apply to this property.
              </FormDescription>
              <Accordion type="multiple" className="w-full">
                {featureCategories.map((category) => (
                  <AccordionItem key={category.title} value={category.title}>
                    <AccordionTrigger className="text-sm font-semibold hover:no-underline bg-muted/50 px-4 rounded-md">
                      {category.title}
                    </AccordionTrigger>
                    <AccordionContent className="p-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {category.features.map((feature) => (
                          <FormItem key={feature} className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 bg-background hover:bg-muted/50 transition-colors">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(feature)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), feature])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== feature
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal text-sm cursor-pointer w-full">
                              {feature}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
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
