
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, MapPin, Mail, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers | Albatross Realtor',
  description: 'Explore job openings and start your career in real estate with Albatross Realtor.',
};

const jobOpenings = [
  {
    title: 'Senior Real Estate Agent',
    location: 'Metropolis, NY',
    type: 'Full-time',
    description: 'Seeking an experienced and motivated real estate agent to join our top-performing team. Must have a proven track record of sales and excellent client management skills.',
  },
  {
    title: 'Digital Marketing Manager',
    location: 'Pleasantville, CA',
    type: 'Full-time',
    description: 'We are looking for a creative Digital Marketing Manager to lead our online presence, manage campaigns, and drive lead generation through various digital channels.',
  },
  {
    title: 'Property Manager',
    location: 'Suburbia, TX',
    type: 'Part-time',
    description: 'Responsible for overseeing a portfolio of rental properties, including tenant relations, maintenance coordination, and financial reporting.',
  },
  {
    title: 'Client Relations Intern',
    location: 'Remote',
    type: 'Internship',
    description: 'An exciting opportunity for a student or recent graduate to gain hands-on experience in the real estate industry by supporting our client relations team.',
  },
];

export default function CareersPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="w-full max-w-4xl mx-auto shadow-xl mb-12 text-center bg-gradient-to-br from-primary/5 via-background to-background">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit mb-4">
            <Briefcase className="w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-headline">Join Our Team</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Build a rewarding career in real estate with a forward-thinking company.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-foreground max-w-2xl mx-auto">
            At Albatross Realtor, we believe in nurturing talent, fostering growth, and creating a collaborative environment where our team can thrive. We are always looking for passionate individuals to join us on our mission to redefine the real estate experience.
          </p>
        </CardContent>
      </Card>
      
      <h2 className="text-2xl font-bold text-center mb-8 font-headline">Current Openings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {jobOpenings.map((job) => (
          <Card key={job.title} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary">{job.title}</CardTitle>
              <div className="flex items-center text-sm text-muted-foreground gap-x-4 gap-y-1 flex-wrap">
                 <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</span>
                 <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> {job.type}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground">{job.description}</p>
            </CardContent>
            <CardContent>
              <Button asChild>
                <a href={`mailto:careers@albatrossrealtor.com?subject=Application for ${job.title}`}>
                  <Mail className="mr-2 h-4 w-4" /> Apply Now
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

       <div className="text-center mt-12">
          <p className="text-lg font-semibold">Don't see a role that fits?</p>
          <p className="text-muted-foreground mb-4">We're always open to connecting with talented people. Send your resume to our HR team!</p>
          <Button variant="outline" asChild>
             <a href="mailto:careers@albatrossrealtor.com?subject=General Application">
              <Mail className="mr-2 h-4 w-4" /> Submit Your Resume
            </a>
          </Button>
        </div>

    </div>
  );
}
