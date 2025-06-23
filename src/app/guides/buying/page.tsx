
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Wallet, Search, Home, Key } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Home Buying Guide | Albatross Realtor',
  description: 'Your comprehensive resource for navigating the property buying process from start to finish.',
};

const buyingSteps = [
  {
    step: 1,
    title: 'Financial Preparation',
    description: 'Assess your budget, check your credit score, and save for a down payment. This is the foundation of your home search.',
    icon: Wallet,
    link: '/financing/calculator',
    linkLabel: 'Use Loan Calculator'
  },
  {
    step: 2,
    title: 'Find the Right Agent',
    description: 'A good real estate agent is your expert guide. They provide market knowledge, negotiation skills, and manage the paperwork.',
    icon: Users,
    link: '#',
    linkLabel: 'Find an Agent (Coming Soon)'
  },
  {
    step: 3,
    title: 'Search for Properties',
    description: 'Begin your search with a clear idea of your needs. Use our advanced search and AI tools to find your perfect match.',
    icon: Search,
    link: '/properties/for-sale',
    linkLabel: 'Search Properties'
  },
  {
    step: 4,
    title: 'Make an Offer',
    description: 'Once you find the right home, your agent will help you draft a competitive offer based on market conditions and property value.',
    icon: Home,
    link: '/blog',
    linkLabel: 'Learn More on Our Blog'
  },
  {
    step: 5,
    title: 'Closing the Deal',
    description: 'This is the final step. It involves inspections, appraisals, and signing the final paperwork to get the keys to your new home.',
    icon: Key,
    link: '/guides/legal',
    linkLabel: 'Understand Legalities'
  },
];

export default function BuyingGuidesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="w-full max-w-4xl mx-auto shadow-xl mb-12 text-center bg-gradient-to-br from-primary/5 via-background to-background">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit mb-4">
            <ShoppingCart className="w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-headline">The Ultimate Home Buying Guide</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Follow our step-by-step guide to navigate the property buying process with confidence.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="relative max-w-4xl mx-auto">
        {/* The connecting line */}
        <div className="absolute left-1/2 -translate-x-1/2 top-5 w-1 bg-border h-full hidden md:block" />
        
        <div className="space-y-12">
          {buyingSteps.map((step, index) => (
            <div key={step.step} className="md:grid md:grid-cols-2 md:gap-8 items-center relative">
              <div className={`md:col-start-${index % 2 === 0 ? 1 : 2} md:row-start-1`}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                       <div className="flex-shrink-0 bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                          {step.step}
                       </div>
                       <div>
                         <CardTitle className="font-headline text-xl text-primary">{step.title}</CardTitle>
                       </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={step.link}>{step.linkLabel}</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
              {/* Icon on the timeline */}
              <div className="absolute left-1/2 -translate-x-1/2 -translate-y-4 md:translate-y-0 top-0 md:top-1/2 w-10 h-10 bg-background border-2 border-border rounded-full flex items-center justify-center">
                 <step.icon className="w-5 h-5 text-primary" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
// Note: A `Users` icon was intended for Step 2. Assuming it's in lucide-react, if not, it will need a replacement. Let's assume it exists or replace with `UserCheck` or similar. Since I can't check lucide-react library in real-time, I'll use `Users`.
