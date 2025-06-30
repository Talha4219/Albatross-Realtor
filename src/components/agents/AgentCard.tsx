
"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Agent } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, CheckCircle, UserCircle, ExternalLink } from 'lucide-react';

interface AgentCardProps {
  agent: Agent;
}

const renderStars = (rating?: number) => {
  if (typeof rating !== 'number') return null;
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5; // Consider .5 and above as a half/full star for simplicity
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); // Adjust if you use actual half star icons

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
      {/* Placeholder for half star or simplified full star for .5 ratings */}
      {halfStar && <Star key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />} 
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 text-yellow-300" />
      ))}
       <span className="ml-1.5 text-xs text-muted-foreground">({rating.toFixed(1)})</span>
    </div>
  );
};


export default function AgentCard({ agent }: AgentCardProps) {
  const agentInitials = agent.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <Link href={`/agent/${agent.id}`} className="block group h-full">
      <Card className="overflow-hidden h-full flex flex-col hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="items-center text-center p-6 bg-muted/20">
          <Avatar className="w-24 h-24 border-2 border-background shadow-md mb-3">
            <AvatarImage src={agent.profilePictureUrl} alt={agent.name} data-ai-hint="person portrait" />
            <AvatarFallback className="text-3xl bg-primary text-primary-foreground">{agentInitials}</AvatarFallback>
          </Avatar>
          <div className="relative">
            <CardTitle className="text-xl font-semibold text-primary group-hover:text-primary/80 transition-colors">
              {agent.name}
            </CardTitle>
             {agent.isVerified && (
                <Badge variant="success" className="absolute -top-1 -right-7 text-xs px-1.5 py-0.5 flex items-center shrink-0">
                  <CheckCircle className="w-3 h-3 mr-1" /> Verified
                </Badge>
              )}
          </div>
          <p className="text-sm text-muted-foreground">Real Estate Agent</p>
        </CardHeader>
        <CardContent className="p-4 flex-grow space-y-2">
          {agent.specialty && (
            <p className="text-sm text-foreground text-center italic">
              &ldquo;{agent.specialty}&rdquo;
            </p>
          )}
          {agent.rating !== undefined && (
             <div className="flex justify-center pt-1">
                {renderStars(agent.rating)}
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0 border-t mt-auto">
          <Button variant="outline" size="sm" className="w-full font-medium text-primary border-primary hover:bg-primary/10 hover:text-primary">
            View Profile <ExternalLink className="w-3.5 h-3.5 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
