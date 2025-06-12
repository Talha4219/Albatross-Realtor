import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function PropertyNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4">
      <AlertTriangle className="w-24 h-24 text-destructive mb-6" />
      <h1 className="text-4xl font-headline font-bold mb-4">Property Not Found</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Sorry, we couldn&apos;t find the property you were looking for. It might have been sold, rented, or the link might be incorrect.
      </p>
      <div className="flex space-x-4">
        <Button asChild size="lg" className="font-headline">
          <Link href="/">Go to Homepage</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="font-headline">
          <Link href="/#search">Search Again</Link>
        </Button>
      </div>
    </div>
  );
}
