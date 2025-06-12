
"use client";

import Image from 'next/image';
import type { Testimonial } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, MessageSquareQuote } from 'lucide-react';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const renderStars = () => {
    const fullStars = Math.floor(testimonial.rating);
    const halfStar = testimonial.rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {/* Placeholder for half star if needed, for now only full stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-yellow-300" />
        ))}
      </div>
    );
  };
  
  const initials = testimonial.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <Card className="h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
      <CardHeader className="flex flex-row items-center gap-4 pb-3">
        <Avatar className="w-16 h-16">
          {testimonial.imageUrl && <AvatarImage src={testimonial.imageUrl} alt={testimonial.name} data-ai-hint={testimonial.dataAiHint || "person"} />}
          <AvatarFallback className="text-xl bg-primary text-primary-foreground">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-semibold text-lg text-primary">{testimonial.name}</h4>
          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-3 relative pt-0">
        <MessageSquareQuote className="w-8 h-8 text-accent opacity-20 absolute top-0 left-0 transform -translate-x-2 -translate-y-2" />
        <blockquote className="text-foreground leading-relaxed italic pl-4 border-l-2 border-accent">
          "{testimonial.quote}"
        </blockquote>
        <div className="flex items-center justify-between pt-2">
          {renderStars()}
          {testimonial.successTag && (
            <Badge variant="secondary" className="text-xs">{testimonial.successTag}</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
