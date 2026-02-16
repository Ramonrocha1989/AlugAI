import { Suspense } from 'react';
import ProposalsClient from './client';
import { Loader2 } from 'lucide-react';

export default function ProposalsPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <ProposalsClient />
    </Suspense>
  );
}
