import ProfileClient from './client';
import { use } from 'react';

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ProfileClient params={{ id }} />;
}
