import { Metadata } from 'next';
import MachineDetailsClient from './client';
import { machineService } from '@/services/machine-api';
import { CATEGORIES, BUSINESS_TYPES } from '@/lib/constants';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const machine = await machineService.getById(params.id);

  if (!machine) {
    return {
      title: 'Máquina não encontrada',
    };
  }

  const title = `${machine.name} - ${machine.yearModel} | ${machine.city}, ${machine.state}`;
  const description = `${BUSINESS_TYPES[machine.businessType]} - ${machine.description.substring(0, 155)}...`;
  const price = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(machine.price);

  return {
    title,
    description,
    keywords: [
      machine.manufacturer,
      machine.model,
      machine.name,
      CATEGORIES[machine.category],
      machine.city,
      machine.state,
      'máquina agrícola',
      'trator',
      'colheitadeira',
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      url: `/machine/${machine.id}`,
      images: [
        {
          url: machine.images[0] || '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: machine.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [machine.images[0] || '/og-image.jpg'],
    },
  };
}

export default function MachineDetailsPage({ params }: Props) {
  return <MachineDetailsClient params={params} />;
}
