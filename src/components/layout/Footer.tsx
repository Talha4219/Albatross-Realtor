
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Home, Facebook, Twitter, Instagram, Linkedin, MessageSquare, ShieldCheck, ExternalLink } from 'lucide-react';

export default function Footer() {
  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailInput = e.currentTarget.elements.namedItem('email') as HTMLInputElement;
    if (emailInput) {
      console.log('Footer Newsletter subscription for:', emailInput.value);
      alert(`Thank you for subscribing with ${emailInput.value}! (Placeholder)`);
      emailInput.value = '';
    }
  };

  const currentYear = new Date().getFullYear();

  const footerNavLinks = {
    aboutUs: [
      { title: 'Our Story', href: '/about/story' },
      { title: 'Team', href: '/about/team' },
      { title: 'Careers', href: '/about/careers' },
      { title: 'Contact Us', href: '/contact' },
    ],
    services: [
      { title: 'Search Properties', href: '/#property-search-section' },
      { title: 'New Projects', href: '/new-projects' },
      { title: 'Loan Calculator', href: '/financing/calculator' },
    ],
    resources: [
      { title: 'Blog', href: '/blog' },
      { title: 'Market Trends', href: '/market-trends' },
      { title: 'Buying Guides', href: '/guides/buying' },
      { title: 'Legal Tips', href: '/guides/legal' },
      { title: 'All Guides', href: '/guides' },
    ],
    forProfessionals: [
      { title: 'Post a Listing', href: '/post-listing' },
      { title: 'Advertising Options', href: '/advertise' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', href: 'https://www.facebook.com/Albatrossrealtorpvtltd/', icon: Facebook },
    { name: 'Twitter', href: 'https://twitter.com', icon: Twitter },
    { name: 'Instagram', href: 'https://www.instagram.com/albatross_realtor/', icon: Instagram },
    { name: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
  ];

  return (
    <footer className="bg-muted text-muted-foreground border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Navigation Columns */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">About Us</h3>
            <ul className="space-y-2">
              {footerNavLinks.aboutUs.map(link => (
                <li key={link.title}><Link href={link.href} className="hover:text-primary transition-colors text-sm">{link.title}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-3">Services</h3>
            <ul className="space-y-2">
              {footerNavLinks.services.map(link => (
                <li key={link.title}><Link href={link.href} className="hover:text-primary transition-colors text-sm">{link.title}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-3">Resources</h3>
            <ul className="space-y-2">
              {footerNavLinks.resources.map(link => (
                <li key={link.title}><Link href={link.href} className="hover:text-primary transition-colors text-sm">{link.title}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-3">List With Us</h3>
            <ul className="space-y-2">
              {footerNavLinks.forProfessionals.map(link => (
                <li key={link.title}><Link href={link.href} className="hover:text-primary transition-colors text-sm">{link.title}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Newsletter Signup */}
          <div className="md:col-span-1">
            <h3 className="font-semibold text-foreground mb-3">Stay Updated</h3>
            <p className="text-sm mb-3">Subscribe to our newsletter for the latest market news and property listings.</p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                className="flex-grow text-sm h-10 bg-background"
                aria-label="Email for newsletter"
              />
              <Button type="submit" size="sm" className="h-10">Subscribe</Button>
            </form>
            <p className="text-xs mt-2">We respect your privacy. <Link href="/privacy-policy" className="underline hover:text-primary">Privacy Policy</Link>.</p>
          </div>

          {/* Contact Information */}
          <div className="md:col-span-1">
            <h3 className="font-semibold text-foreground mb-3">Contact Us</h3>
            <address className="not-italic text-sm space-y-1">
              <p>541F, Block 'D', Main Boulevard, Wapda Town, Islamabad</p>
              <p>Phone 1: <a href="tel:+923216340539" className="hover:text-primary transition-colors">+92 321 6340539</a></p>
              <p>Phone 2: <a href="tel:+923330966025" className="hover:text-primary transition-colors">+92 333 0966025</a></p>
              <p>Email: <a href="mailto:support@albatrossrealtor.com" className="hover:text-primary transition-colors">support@albatrossrealtor.com</a></p>
              <p>Office Hours: Mon-Fri, 9 AM - 5 PM</p>
            </address>
          </div>

          {/* Social Media Links */}
          <div className="md:col-span-1">
            <h3 className="font-semibold text-foreground mb-3">Follow Us</h3>
            <div className="flex space-x-4">
              {socialLinks.map(link => (
                <Link key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.name}
                      className="text-muted-foreground hover:text-primary transition-colors">
                  <link.icon className="w-6 h-6" />
                </Link>
              ))}
            </div>
             <div className="mt-4">
                <h3 className="font-semibold text-foreground mb-2 text-sm">Trust & Security</h3>
                <div className="flex items-center gap-2 text-xs">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    <span>Secure Transactions & Verified Listings</span>
                </div>
                <p className="text-xs mt-1">[Placeholder for Security Badges]</p>
             </div>
          </div>
        </div>
        
        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="flex flex-col sm:flex-row items-center gap-x-4 gap-y-2 mb-4 md:mb-0">
            <Link href="/" className="flex items-center gap-1.5 text-foreground hover:text-primary transition-colors">
              <Home className="w-5 h-5 text-primary" />
              <span className="font-semibold">Albatross Realtor</span>
            </Link>
            <p>&copy; {currentYear}. All Rights Reserved.</p>
             <p>
              Powered by <Link href="https://talhashams.vercel.app" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">Agilex Developers <ExternalLink className="inline-block h-3 w-3 ml-0.5" /></Link>
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-x-4 gap-y-2 text-xs">
            <div className="flex items-center gap-1 text-muted-foreground">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Need help? Chat with our AI! &rarr;</span>
            </div>
            <nav className="flex space-x-3">
              <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link href="/cookie-policy" className="hover:text-primary transition-colors">Cookie Policy</Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
