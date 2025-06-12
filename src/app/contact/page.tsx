
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MailQuestion } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-200px)] flex flex-col items-center justify-center">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit mb-4">
            <MailQuestion className="w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-headline">Contact Us</CardTitle>
          <CardDescription className="text-lg">
            Get in touch with Albatross Realtor. We're here to help!
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6">
            Find our contact details, office location, and a form to send us your inquiries. We look forward to hearing from you.
            (Contact form and map integration will be added here.)
          </p>
          <div className="space-y-2 text-lg mb-6">
            <p><strong>Email:</strong> support@albatrossrealtor.com</p>
            <p><strong>Phone 1:</strong> +92 321 6340539</p>
            <p><strong>Phone 2:</strong> +92 333 0966025</p>
            <p><strong>Address:</strong> 541F, Block 'D', Main Boulevard, Wapda Town, Islamabad</p>
          </div>
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
