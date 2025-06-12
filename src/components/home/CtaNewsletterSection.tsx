
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Search, Users, Calculator, MessageSquare, ShieldCheck } from 'lucide-react';

export default function CtaNewsletterSection() {
  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Placeholder for newsletter submission logic
    const emailInput = e.currentTarget.elements.namedItem('email') as HTMLInputElement;
    if (emailInput) {
      console.log('Newsletter subscription for:', emailInput.value);
      alert(`Thank you for subscribing with ${emailInput.value}! (Placeholder)`);
      emailInput.value = '';
    }
  };

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <Card className="shadow-xl border-none bg-gradient-to-br from-primary/5 via-background to-background">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit mb-4 shadow-lg">
              <Mail className="w-10 h-10" />
            </div>
            <CardTitle className="text-3xl md:text-4xl font-headline font-bold text-primary mb-2">
              Ready to Find Your Perfect Property?
            </CardTitle>
            <CardDescription className="text-lg max-w-2xl mx-auto text-muted-foreground">
              Search verified listings, connect with top agents, or get the latest market updates delivered to your inbox.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-10">
            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button size="lg" asChild className="font-headline w-full sm:w-auto">
                <Link href="#property-search-section">
                  <Search className="mr-2" /> Search Properties
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="font-headline w-full sm:w-auto">
                <Link href="/agents/find">
                  <Users className="mr-2" /> Find an Agent
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="font-headline w-full sm:w-auto">
                <Link href="/financing/calculator">
                  <Calculator className="mr-2" /> Use Loan Calculator
                </Link>
              </Button>
            </div>

            {/* Newsletter Signup Form */}
            <div className="max-w-xl mx-auto text-center">
              <h3 className="text-xl font-semibold text-foreground mb-3">Stay Updated</h3>
              <p className="text-muted-foreground mb-4">
                Subscribe to our newsletter for the latest property listings, market news, and exclusive offers.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 items-center">
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  required
                  className="flex-grow text-base h-12"
                  aria-label="Email for newsletter"
                />
                <Button type="submit" size="lg" className="w-full sm:w-auto h-12 font-headline">
                  Subscribe
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-3">
                <ShieldCheck className="w-3.5 h-3.5 inline-block mr-1 opacity-70" />
                Your privacy is protected. We never spam.
              </p>
            </div>

            {/* Trust Elements Placeholder */}
            <div className="text-center text-sm text-muted-foreground italic">
              <p>[Trust Elements: Join 50K+ Subscribers | Secure Data - Placeholder]</p>
            </div>
            
            {/* Secondary CTA Placeholder */}
             <div className="text-center">
              <Button variant="link" asChild>
                <Link href="/resources">Explore More Tools & Guides</Link>
              </Button>
            </div>


            {/* AI Chat Integration Placeholder */}
            <p className="text-center text-xs text-muted-foreground italic mt-6">
              <MessageSquare className="w-3.5 h-3.5 inline-block mr-1" />
              Questions about properties or financing? Ask our AI! (Bottom Right) &rarr;
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
