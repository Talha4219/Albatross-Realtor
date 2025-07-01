
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PropertyTypeEnum as PropertyTypeType, PropertyStatusEnum } from '@/types';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import Image from 'next/image';

const propertyTypes: PropertyTypeType[] = [
    'House', 'Apartment', 'Condo', 'Townhouse', 'Land', 'Plot', 
    'Flat', 'Upper Portion', 'Lower Portion', 'Farm House', 'Room', 'Penthouse',
    'Residential Plot', 'Commercial Plot', 'Agricultural Land', 'Industrial Land', 'Plot File', 'Plot Form',
    'Office', 'Shop', 'Warehouse', 'Factory', 'Building', 'Other'
];
const userSettablePropertyStatuses: PropertyStatusEnum[] = ['For Sale', 'For Rent', 'Draft']; 

const areaUnits = ['Marla', 'Kanal', 'Sq. Ft.', 'Sq. M.', 'Sq. Yd.'] as const;
type AreaUnit = typeof areaUnits[number];

const conversionFactors: Record<AreaUnit, number> = {
  'Marla': 272.25,
  'Kanal': 5445, 
  'Sq. Ft.': 1,
  'Sq. M.': 10.7639,
  'Sq. Yd.': 9,
};

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
  status: z.enum(userSettablePropertyStatuses), 
  yearBuilt: z.coerce.number().optional().nullable().refine(val => val === null || val === undefined || (val >= 1800 && val <= new Date().getFullYear() + 5), {
    message: `Year built must be between 1800 and ${new Date().getFullYear() + 5}. Leave empty if not applicable.`
  }),
  images: z.array(z.string().min(1, "Image data cannot be empty.")).min(1, "At least one image is required."),
  features: z.array(z.string().min(1, "Feature cannot be empty.")).optional(),
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

export default function PropertyForm({ onSubmit, initialData, isLoading, formType = 'create' }: PropertyFormProps) {
  const searchParams = useSearchParams();
  const defaultPropertyType = searchParams.get('type') as PropertyTypeType | null;

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
      propertyType: defaultPropertyType || 'House',
      status: 'For Sale',
      yearBuilt: null,
      images: [],
      features: [''],
      ...initialData,
    },
  });
  
  const [imagePreviews, setImagePreviews] = useState<string[]>(initialData?.images || []);
  const [featureFields, setFeatureFields] = useState<string[]>(initialData?.features && initialData.features.length > 0 ? initialData.features : ['']);
  
  const [areaMagnitude, setAreaMagnitude] = useState<number | string>('');
  const [areaUnit, setAreaUnit] = useState<AreaUnit>('Marla');

  const currentPropertyType = form.watch('propertyType');
  const plotTypes: PropertyTypeType[] = ['Plot', 'Land', 'Residential Plot', 'Commercial Plot', 'Agricultural Land', 'Industrial Land', 'Plot File', 'Plot Form'];
  const isPlotOrLand = plotTypes.includes(currentPropertyType);

  useEffect(() => {
    const magnitude = parseFloat(String(areaMagnitude));
    if (!isNaN(magnitude) && magnitude > 0) {
      const sqFt = magnitude * conversionFactors[areaUnit];
      form.setValue('areaSqFt', sqFt, { shouldValidate: true });
    } else {
      form.setValue('areaSqFt', 0, { shouldValidate: true });
    }
  }, [areaMagnitude, areaUnit, form]);


  useEffect(() => {
    const initialType = initialData?.propertyType || defaultPropertyType || 'House';
    const valuesToReset = {
        ...form.getValues(),
        address: '',
        city: '',
        state: '',
        zip: '',
        price: 0,
        bedrooms: 0,
        bathrooms: 0,
        areaSqFt: 0,
        description: '',
        propertyType: initialType,
        status: 'For Sale',
        yearBuilt: null,
        images: [],
        features: [''],
        ...initialData,
    };
    form.reset(valuesToReset);
    setImagePreviews(initialData?.images || []);
    setFeatureFields(initialData?.features && initialData.features.length > 0 ? initialData.features : ['']);

    if (initialData?.areaSqFt) {
        setAreaUnit('Sq. Ft.');
        setAreaMagnitude(initialData.areaSqFt);
    } else {
        setAreaUnit('Marla');
        setAreaMagnitude('');
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, defaultPropertyType]);


  useEffect(() => {
    if (isPlotOrLand) {
      form.setValue('bedrooms', 0);
      form.setValue('bathrooms', 0);
    }
  }, [currentPropertyType, form, isPlotOrLand]);

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
        form.setValue('images', updatedFiles, { shouldValidate: true });
    });
  };

  const removeImage = (index: number) => {
      const updatedImages = [...imagePreviews];
      updatedImages.splice(index, 1);
      setImagePreviews(updatedImages);
      form.setValue('images', updatedImages, { shouldValidate: true });
  }

  const processSubmit: SubmitHandler<PropertyFormData> = (data) => {
    const processedData = {
      ...data,
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
                <FormLabel>Price (Rs)</FormLabel>
                <FormControl><Input type="number" placeholder="e.g., 750000" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
              <FormItem>
                  <FormLabel>Area</FormLabel>
                  <FormControl>
                      <Input 
                          type="number" 
                          placeholder="e.g., 5" 
                          value={areaMagnitude}
                          onChange={(e) => setAreaMagnitude(e.target.value)}
                      />
                  </FormControl>
              </FormItem>
              <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <Select value={areaUnit} onValueChange={(value: AreaUnit) => setAreaUnit(value)}>
                      <FormControl>
                          <SelectTrigger>
                              <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                          {areaUnits.map(unit => (
                              <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
              </FormItem>
          </div>

          {!isPlotOrLand && (
              <>
                <FormField
                    control={form.control}
                    name="bedrooms"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Bedrooms</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 3" {...field} disabled={isPlotOrLand} /></FormControl>
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
                        <FormControl><Input type="number" step="0.5" placeholder="e.g., 2.5" {...field} disabled={isPlotOrLand} /></FormControl>
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
            name="areaSqFt"
            render={({ field }) => (
                <FormItem className="hidden">
                    <FormLabel>Area in Square Feet (calculated)</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />


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
                <Select onValueChange={field.onChange} value={field.value} defaultValue={initialData?.propertyType || defaultPropertyType || 'House'}>
                    <FormControl><SelectTrigger disabled><SelectValue placeholder="Select property type" /></SelectTrigger></FormControl>
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
        </div>

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
          render={() => (
            <FormItem>
              <FormLabel>Features (Optional, one per line)</FormLabel>
              {featureFields.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <FormControl>
                    <Input
                      placeholder={`Feature ${index + 1} (e.g., Gated Community)`}
                      value={feature || ''}
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
