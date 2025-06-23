
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users2, Linkedin, Twitter } from 'lucide-react';
import type { Metadata } from 'next';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Our Team | Albatross Realtor',
  description: 'Meet the dedicated professionals and expert agents behind Albatross Realtor.',
};

const teamMembers = [
  {
    name: 'John Doe',
    role: 'Founder & CEO',
    bio: 'John is a visionary leader with over 20 years of experience in the real estate industry. He is passionate about leveraging technology to simplify property transactions.',
    imageUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'ceo portrait',
    socials: { linkedin: '#', twitter: '#' },
  },
  {
    name: 'Jane Smith',
    role: 'Chief Technology Officer',
    bio: 'Jane leads our technology division, driving innovation and ensuring our platform is robust, secure, and user-friendly. She has a background in AI and machine learning.',
    imageUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'woman developer portrait',
    socials: { linkedin: '#', twitter: '#' },
  },
  {
    name: 'Alice Johnson',
    role: 'Head of Sales',
    bio: 'Alice manages our team of top-performing agents. Her expertise in market analysis and client relations ensures our clients always get the best deals.',
    imageUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'salesperson portrait',
    socials: { linkedin: '#', twitter: '#' },
  },
   {
    name: 'Robert Brown',
    role: 'Lead Marketing Strategist',
    bio: 'Robert is the creative force behind our brand. He develops innovative marketing campaigns that connect buyers and sellers across the globe.',
    imageUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'man marketing portrait',
    socials: { linkedin: '#', twitter: '#' },
  },
];

export default function TeamPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit mb-4">
          <Users2 className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-headline font-bold text-primary">Meet Our Team</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-2">
          The dedicated professionals working to make your real estate journey seamless and successful.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {teamMembers.map((member) => (
          <Card key={member.name} className="text-center hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-primary/20">
                <AvatarImage src={member.imageUrl} alt={member.name} data-ai-hint={member.dataAiHint} />
                <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold text-foreground">{member.name}</h3>
              <p className="text-primary font-medium">{member.role}</p>
              <p className="text-sm text-muted-foreground mt-2">{member.bio}</p>
            </CardContent>
            <CardContent className="border-t p-4">
              <div className="flex justify-center space-x-4">
                <Link href={member.socials.linkedin} className="text-muted-foreground hover:text-primary"><Linkedin className="w-5 h-5" /></Link>
                <Link href={member.socials.twitter} className="text-muted-foreground hover:text-primary"><Twitter className="w-5 h-5" /></Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
