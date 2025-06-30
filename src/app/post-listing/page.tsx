
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit3, CheckCircle, TrendingUp, Users } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'List Your Property | Albatross Realtor',
  description: 'List your property with Albatross Realtor and reach thousands of potential buyers and renters.',
};

const benefits = [
    {
        icon: TrendingUp,
        title: "Maximum Exposure",
        description: "Your listing will be seen by thousands of active buyers and renters visiting our site daily."
    },
    {
        icon: Users,
        title: "Reach Serious Buyers",
        description: "We connect you with a targeted audience of serious, pre-qualified individuals actively looking for properties."
    },
    {
        icon: CheckCircle,
        title: "Verified & Trusted",
        description: "Our verification process adds a layer of trust to your listing, attracting more reliable offers."
    }
];

export default function PostListingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
        <Card className="w-full max-w-4xl mx-auto shadow-xl text-center bg-gradient-to-br from-primary/5 via-background to-background">
            <CardHeader>
              <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit mb-4">
                <Edit3 className="w-10 h-10" />
              </div>
              <CardTitle className="text-3xl font-headline">Sell or Rent Your Property with Albatross</CardTitle>
              <CardDescription className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join our platform to connect with thousands of potential buyers and renters. It's simple, fast, and effective.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                    {benefits.map(benefit => (
                        <div key={benefit.title} className="p-4">
                            <div className="mx-auto bg-secondary text-secondary-foreground rounded-full p-3 w-fit mb-3">
                                <benefit.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold">{benefit.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{benefit.description}</p>
                        </div>
                    ))}
                </div>
                <p className="text-muted-foreground mb-6">
                    Ready to get started? Our easy-to-use form will guide you through the process of creating a beautiful and effective listing.
                </p>
                <Button asChild size="lg" className="font-headline text-lg">
                    <Link href="/add-listing">
                        List Your Property Now
                    </Link>
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
