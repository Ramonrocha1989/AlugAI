import ProfileClient from './client';

export default function ProfilePage({ params }: { params: { id: string } }) {
  return <ProfileClient params={params} />;
}
