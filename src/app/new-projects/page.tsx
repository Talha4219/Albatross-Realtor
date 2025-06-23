
import NewProjectsListing from '@/components/projects/NewProjectsListing';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Projects | Albatross Realtor',
  description: 'Discover the latest and most exciting new real estate developments and projects.',
};

export default function NewProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <NewProjectsListing />
    </div>
  );
}
