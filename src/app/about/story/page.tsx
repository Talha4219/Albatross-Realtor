
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookHeart, Rocket, Users, Target } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Story | Albatross Realtor',
  description: 'Learn about the history, mission, and values that drive Albatross Realtor.',
};

export default function OurStoryPage() {
  return (
    <div className="container mx-auto px-4 py-12">
        <Card className="w-full max-w-4xl mx-auto shadow-xl overflow-hidden">
            <CardHeader className="text-center p-8 bg-gradient-to-br from-primary/10 via-background to-background">
              <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit mb-4">
                <BookHeart className="w-10 h-10" />
              </div>
              <CardTitle className="text-3xl md:text-4xl font-headline text-primary">Our Story</CardTitle>
              <CardDescription className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Redefining the real estate experience through innovation, trust, and client-centric values.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-8">
                <div className="prose dark:prose-invert max-w-none text-lg text-foreground">
                    <p>
                        Founded in 2020, Albatross Realtor was born from a simple yet powerful idea: to make real estate accessible, transparent, and trustworthy for everyone. Our founders, a team of seasoned real estate professionals and tech enthusiasts, saw an industry ripe for innovation. They envisioned a platform that could leverage technology to simplify complex processes while keeping the human element—expert guidance and genuine care—at its core.
                    </p>
                     <p>
                        From a small startup with a handful of listings, we have grown into a dynamic real estate marketplace, connecting thousands of buyers, sellers, and agents. Our journey has been one of constant learning, adaptation, and an unwavering commitment to our clients' success.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <Card className="p-4 bg-secondary/50">
                        <Rocket className="w-8 h-8 mx-auto text-accent mb-2" />
                        <h3 className="font-semibold text-lg text-foreground">Our Mission</h3>
                        <p className="text-sm text-muted-foreground">To empower clients with the best tools, data, and expert guidance to make confident real estate decisions.</p>
                    </Card>
                    <Card className="p-4 bg-secondary/50">
                        <Users className="w-8 h-8 mx-auto text-accent mb-2" />
                        <h3 className="font-semibold text-lg text-foreground">Our Values</h3>
                        <p className="text-sm text-muted-foreground">Integrity, Innovation, and Client-Centricity. We operate with transparency and always put our clients' interests first.</p>
                    </Card>
                     <Card className="p-4 bg-secondary/50">
                        <Target className="w-8 h-8 mx-auto text-accent mb-2" />
                        <h3 className="font-semibold text-lg text-foreground">Our Vision</h3>
                        <p className="text-sm text-muted-foreground">To become the most trusted and technologically advanced real estate platform, creating seamless experiences for all.</p>
                    </Card>
                </div>
                 <div className="relative">
                    <Image
                        src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxidWlsZGluZ3xlbnwwfHx8fDE3NDk3MDQ1ODd8MA&ixlib=rb-4.1.0&q=80&w=1080"
                        alt="Modern office building representing the company's vision"
                        width={1200}
                        height={400}
                        className="w-full h-64 object-cover rounded-lg mt-4"
                        data-ai-hint="office building modern"
                    />
                    <div className="absolute inset-0 bg-black/30 rounded-lg"></div>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
