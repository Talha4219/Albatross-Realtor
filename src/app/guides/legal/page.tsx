
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gavel, FileText, Scale, ShieldCheck, AlertTriangle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Legal Guides & Tips | Albatross Realtor',
  description: 'Understand the legal aspects of real estate transactions with our helpful guides.',
};

const legalTopics = [
  {
    title: 'Understanding Property Titles',
    description: "Learn about the different types of property titles and the importance of a clear title for a secure investment.",
    icon: FileText
  },
  {
    title: 'Navigating Purchase Agreements',
    description: "A breakdown of the key clauses in a standard purchase agreement, from contingencies to closing dates.",
    icon: Scale
  },
  {
    title: 'The Role of Escrow',
    description: "Understand how a neutral third-party (escrow) holds funds and documents to ensure a safe and fair transaction for all parties.",
    icon: ShieldCheck
  },
   {
    title: 'Common Closing Costs',
    description: "An overview of the various fees and expenses that buyers and sellers typically encounter at the closing of a real estate deal.",
    icon: Gavel
  }
];

export default function LegalGuidesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="w-full max-w-4xl mx-auto shadow-xl mb-12 text-center bg-gradient-to-br from-primary/5 via-background to-background">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit mb-4">
            <Gavel className="w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-headline">Legal Tips & Guides</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Navigating the legal landscape of real estate with clarity.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {legalTopics.map((topic) => (
          <Card key={topic.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
              <topic.icon className="w-8 h-8 text-primary flex-shrink-0" />
              <CardTitle className="font-headline text-xl text-primary">{topic.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{topic.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

       <Card className="max-w-4xl mx-auto mt-12 border-destructive bg-destructive/10">
        <CardHeader className="flex flex-row items-center gap-4">
          <AlertTriangle className="w-8 h-8 text-destructive" />
          <CardTitle className="font-headline text-xl text-destructive">Disclaimer</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive-foreground">
            The information provided on this page and in our guides is for general informational purposes only and does not constitute legal advice. Real estate laws vary by location. We strongly recommend consulting with a qualified real estate attorney for advice on your specific situation.
          </p>
        </CardContent>
      </Card>

    </div>
  );
}
