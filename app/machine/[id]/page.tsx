import MachineDetailsClient from './client';

type Props = {
  params: { id: string };
};

export default function MachineDetailsPage({ params }: Props) {
  return <MachineDetailsClient params={params} />;
}
