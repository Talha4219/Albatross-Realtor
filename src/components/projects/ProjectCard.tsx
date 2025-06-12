
"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ExternalLink, Building, MapPin, ListChecks } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={project.learnMoreLink || '/new-projects'} className="block group h-full">
      <Card className="overflow-hidden h-full flex flex-col hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="p-0 relative">
          <Image
            src={project.imageUrl}
            alt={`Image of ${project.name}`}
            width={400}
            height={225} // Aspect ratio 16:9 for project images
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={project.dataAiHint || "building construction site"}
          />
          {project.status && (
            <Badge className="absolute top-2 left-2" variant={project.status === 'Trending' ? 'default' : 'secondary'}>
              {project.status}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <div className="flex justify-between items-start mb-1">
            <CardTitle className="text-xl font-semibold text-primary group-hover:text-primary/80 transition-colors">
              {project.name}
            </CardTitle>
            {project.isVerified && (
              <Badge variant="success" className="text-xs ml-2 flex items-center shrink-0">
                <CheckCircle className="w-3 h-3 mr-1" /> Verified
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground flex items-center mb-1">
            <MapPin className="w-4 h-4 mr-1.5 shrink-0 text-accent" /> {project.location}
          </p>
          <p className="text-sm text-muted-foreground flex items-center mb-3">
            <Building className="w-4 h-4 mr-1.5 shrink-0 text-accent" /> By: {project.developer}
          </p>
          
          {project.keyHighlights && project.keyHighlights.length > 0 && (
            <div className="mt-2 space-y-1">
              <h4 className="text-xs font-medium text-foreground flex items-center"><ListChecks className="w-3.5 h-3.5 mr-1 text-accent" /> Highlights:</h4>
              <ul className="text-xs text-muted-foreground list-disc list-inside pl-1 space-y-0.5">
                {project.keyHighlights.slice(0, 2).map((highlight, index) => (
                  <li key={index}>{highlight}</li>
                ))}
                {project.keyHighlights.length > 2 && <li className="italic">...and more</li>}
              </ul>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0 border-t mt-auto">
          <Button variant="outline" size="sm" className="w-full font-medium text-primary border-primary hover:bg-primary/10 hover:text-primary">
            Learn More <ExternalLink className="w-3.5 h-3.5 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
