
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Sparkles, CalendarDays, Users, ExternalLink } from 'lucide-react';
import Image from 'next/image';

// Mock data for placeholder projects
const mockProjects = [
  {
    id: 'proj1',
    name: 'Skyline Towers',
    developer: 'Prestige Developers Inc.',
    location: 'Metropolis Downtown',
    type: 'Luxury Apartments',
    timeline: 'Completion Q4 2025',
    amenities: ['Rooftop Pool', 'Gym', 'Concierge', 'Smart Homes'],
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'modern building apartment'
  },
  {
    id: 'proj2',
    name: 'Greenwood Villas',
    developer: 'EcoBuild Homes Ltd.',
    location: 'Suburbia Greens',
    type: 'Eco-Friendly Villas',
    timeline: 'Phase 1 Ready Q2 2025',
    amenities: ['Solar Panels', 'Community Garden', 'Clubhouse', 'Jogging Tracks'],
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'house development suburban'
  },
];

export default function NewProjectsListing() {
  return (
    <div className="space-y-8">
      <Card className="shadow-xl border-none bg-gradient-to-br from-primary/10 via-background to-background">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit mb-4 shadow-lg">
            <Sparkles className="w-10 h-10" />
          </div>
          <CardTitle className="font-headline text-4xl text-primary">
            Discover New Projects
          </CardTitle>
          <CardDescription className="text-lg max-w-2xl mx-auto">
            Explore the latest and upcoming residential and commercial real estate developments. 
            Find your future home or investment opportunity here.
          </CardDescription>
        </CardHeader>
      </Card>

      {mockProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mockProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col">
              <CardHeader className="p-0">
                <Image 
                  src={project.imageUrl} 
                  alt={`Image of ${project.name}`} 
                  width={600} 
                  height={350} 
                  className="w-full h-60 object-cover"
                  data-ai-hint={project.dataAiHint}
                />
              </CardHeader>
              <CardContent className="p-6 flex-grow">
                <CardTitle className="font-headline text-2xl text-primary mb-1">{project.name}</CardTitle>
                <p className="text-sm text-muted-foreground mb-3">by {project.developer}</p>
                
                <div className="space-y-2 text-foreground">
                  <p className="flex items-center gap-2"><Building className="w-4 h-4 text-accent" /> {project.type} in {project.location}</p>
                  <p className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-accent" /> {project.timeline}</p>
                  <div>
                    <h4 className="font-semibold mt-2 mb-1">Key Amenities:</h4>
                    <ul className="list-disc list-inside text-sm space-y-0.5">
                      {project.amenities.slice(0, 3).map(amenity => <li key={amenity}>{amenity}</li>)}
                      {project.amenities.length > 3 && <li>...and more</li>}
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0 border-t mt-auto">
                <Button className="w-full font-headline">
                  View Project Details <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
         <div className="text-center py-16 border border-dashed rounded-lg">
          <Building className="w-20 h-20 mx-auto text-muted-foreground mb-6" />
          <h2 className="text-2xl font-semibold text-muted-foreground mb-2">No New Projects Listed Yet</h2>
          <p className="text-muted-foreground mb-6">
            Check back soon for exciting new developments in your area.
          </p>
        </div>
      )}
       <CardDescription className="text-center text-sm text-muted-foreground pt-6">
          Admins will be able to add and manage new projects through a CMS. Project details are illustrative.
      </CardDescription>
    </div>
  );
}
