
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserX } from 'lucide-react';

export default function AgentNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4">
      <UserX className="w-24 h-24 text-destructive mb-6" />
      <h1 className="text-4xl font-headline font-bold mb-4">Agent Not Found</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Sorry, we couldn&apos;t find the agent profile you were looking for. The profile might not exist or the link might be incorrect.
      </p>
      <div className="flex space-x-4">
        <Button asChild size="lg" className="font-headline">
          <Link href="/">Go to Homepage</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="font-headline">
          <Link href="/#search">Search Properties</Link>
        </Button>
      </div>
    </div>
  );
}
