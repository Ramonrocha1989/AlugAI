import { notFound } from 'next/navigation';
import { TestAuthClient } from './test-auth-client';

export default function TestAuthPage() {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  return <TestAuthClient />;
}
