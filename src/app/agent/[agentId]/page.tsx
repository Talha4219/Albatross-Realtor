
"use client";

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Agent, Property } from '@/types';
import { getAgentById, mockProperties } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import PropertyCard from '@/components/property/PropertyCard';
import { Phone, Mail, Briefcase, MessageSquare, CheckCircle, ExternalLink, UserCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AgentProfilePage() {
  const params = useParams();
  const agentId = params.agentId as string;
  const [agent, setAgent] = useState<Agent | null>(null);
  const [agentProperties, setAgentProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (agentId) {
      const foundAgent = getAgentById(agentId);
      if (foundAgent) {
        setAgent(foundAgent);
        const properties = mockProperties.filter(p => p.agent?.id === agentId);
        setAgentProperties(properties);
      } else {
        notFound();
      }
      setIsLoading(false);
    }
  }, [agentId]);

  if (isLoading) {
    return <SkeletonAgentProfilePage />;
  }

  if (!agent) {
    notFound();
    return null;
  }

  const agentInitials = agent.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <Card className="shadow-xl overflow-hidden">
        <div className="bg-muted/30 p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
              <AvatarImage src={agent.imageUrl} alt={agent.name} data-ai-hint="person portrait" />
              <AvatarFallback className="text-4xl bg-primary text-primary-foreground">{agentInitials}</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <h1 className="text-4xl font-headline font-bold text-primary">{agent.name}</h1>
                {agent.isVerified && (
                  <Badge variant="success" className="text-sm px-3 py-1">
                    <CheckCircle className="w-4 h-4 mr-1.5" /> Verified Agent
                  </Badge>
                )}
              </div>
              <p className="text-lg text-muted-foreground">Real Estate Professional</p>
              <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
                <Button variant="outline" size="sm" asChild>
                  <a href={`tel:${agent.phone}`} className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" /> Call
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={`mailto:${agent.email}`} className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" /> Email
                  </a>
                </Button>
                 <Button size="sm">
                    <MessageSquare className="w-4 h-4 mr-2" /> Message Agent
                </Button>
              </div>
            </div>
          </div>
        </div>
        <CardContent className="p-6 space-y-4">
           <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">About {agent.name}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {/* Placeholder bio */}
              {agent.name} is a dedicated and experienced real estate professional committed to helping clients achieve their property goals. With a deep understanding of the local market and a passion for service, {agent.name} provides expert guidance for buying, selling, or renting properties.
            </p>
           </div>
        </CardContent>
      </Card>

      <Separator />

      <div>
        <h2 className="text-3xl font-headline font-semibold mb-6 flex items-center gap-2">
          <Briefcase className="w-7 h-7 text-primary" /> Properties Listed by {agent.name} ({agentProperties.length})
        </h2>
        {agentProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agentProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12 border-dashed">
            <CardContent>
              <UserCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{agent.name} currently has no active listings.</p>
            </CardContent>
          </Card>
        )}
      </div>
      
      <Separator />

      <div>
        <h2 className="text-3xl font-headline font-semibold mb-6">Client Reviews</h2>
        <Card className="shadow-md">
          <CardContent className="p-8 text-center">
            <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Client reviews and testimonials will be displayed here soon.</p>
            <Button variant="outline" className="mt-6">
              Leave a Review for {agent.name}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const SkeletonAgentProfilePage = () => (
  <div className="container mx-auto px-4 py-8 space-y-12 animate-pulse">
    <Card className="shadow-xl overflow-hidden">
      <div className="bg-muted/30 p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Skeleton className="w-32 h-32 rounded-full" />
          <div className="text-center md:text-left flex-1">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <Skeleton className="h-10 w-48" /> {/* Name */}
              <Skeleton className="h-7 w-28" /> {/* Badge */}
            </div>
            <Skeleton className="h-6 w-32" /> {/* Title */}
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
              <Skeleton className="h-9 w-24" /> {/* Call Button */}
              <Skeleton className="h-9 w-24" /> {/* Email Button */}
              <Skeleton className="h-9 w-32" /> {/* Message Button */}
            </div>
          </div>
        </div>
      </div>
      <CardContent className="p-6">
        <Skeleton className="h-5 w-1/4 mb-2" /> {/* About Title */}
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
    </Card>
    <Separator />
    <div>
      <Skeleton className="h-8 w-1/2 mb-6" /> {/* Listed Properties Title */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <Skeleton className="h-48 w-full rounded-t-lg" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
    <Separator />
     <div>
      <Skeleton className="h-8 w-1/3 mb-6" /> {/* Client Reviews Title */}
      <Card><CardContent className="p-8"><Skeleton className="h-24 w-full" /></CardContent></Card>
    </div>
  </div>
);

