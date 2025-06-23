
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Megaphone, Star, TrendingUp, CheckCircle } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Advertise With Us | Albatross Realtor',
  description: 'Showcase your properties or services to a targeted real estate audience.',
};

const advertisingOptions = [
  {
    title: 'Featured Property',
    price: '$99 / month',
    description: 'Get your property featured on our homepage and at the top of search results to maximize visibility.',
    features: ['Homepage placement', 'Top search ranking', 'Increased impressions', 'Analytics report'],
    icon: Star,
  },
  {
    title: 'Developer Spotlight',
    price: '$299 / month',
    description: 'Showcase your new development project to thousands of potential investors and homebuyers.',
    features: ['Dedicated project page', 'Homepage banner', 'Email newsletter feature', 'Social media promotion'],
    icon: TrendingUp,
  },
  {
    title: 'Banner Advertising',
    price: 'Contact for Quote',
    description: 'Place your brand in front of a targeted real estate audience with banner ads across our site.',
    features: ['Multiple ad sizes', 'Geo-targeting options', 'High-traffic pages', 'Detailed performance metrics'],
    icon: Megaphone,
  },
];

export default function AdvertisePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit mb-4">
          <Megaphone className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-headline font-bold text-primary">Advertise With Us</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-2">
          Showcase your properties, projects, and services to a highly engaged real estate audience.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {advertisingOptions.map((option) => (
          <Card key={option.title} className="flex flex-col hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto bg-secondary text-secondary-foreground rounded-full p-3 w-fit mb-3">
                <option.icon className="w-6 h-6" />
              </div>
              <CardTitle className="font-headline text-2xl text-foreground">{option.title}</CardTitle>
              <p className="text-2xl font-bold text-primary">{option.price}</p>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground text-center mb-4">{option.description}</p>
              <ul className="space-y-2 text-sm">
                {option.features.map(feature => (
                  <li key={feature} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardContent className="mt-auto">
              <Button className="w-full font-headline" asChild>
                <Link href="/contact">Get Started</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

       <div className="text-center mt-12 bg-muted/50 p-8 rounded-lg">
          <h3 className="text-2xl font-semibold font-headline mb-2">Why Advertise with Albatross Realtor?</h3>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Reach thousands of active homebuyers, sellers, and investors. Our platform's targeted audience ensures your marketing budget is spent effectively, connecting you with people who are ready to make a move.
          </p>
        </div>

    </div>
  );
}
