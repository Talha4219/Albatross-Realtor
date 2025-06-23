
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Briefcase } from 'lucide-react'; // Using Briefcase, as BriefcaseBusiness is not in lucide-react
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers | Albatross Realtor',
  description: 'Explore job openings and start your career in real estate with Albatross Realtor.',
};

export default function CareersPage() {
  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-200px)] flex flex-col items-center justify-center">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit mb-4">
            <Briefcase className="w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-headline">Careers</CardTitle>
          <CardDescription className="text-lg">
            Join our team and build a rewarding career in real estate.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6">
            Explore current job openings, learn about our company culture, and find out how you can become a part of Albatross Realtor.
          </p>
          <Button asChild size="lg">
            <Link href="/" className="flex items-center">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Homepage
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
