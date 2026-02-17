import { Metadata } from 'next';
import MachineDetailsClient from './client';
import { machineService } from '@/services/machine-api';
import { BUSINESS_TYPES, CATEGORIES } from '@/lib/constants';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const machine = await machineService.getById(params.id);
    
    if (!machine) {
      return {
        title: 'Máquina não encontrada',
      };
    }

    const price = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(machine.price);

    const priceDisplay = machine.businessType === 'RENTAL' ? `${price}/dia` : price;
    const title = `${machine.name} - ${machine.yearModel} | ${priceDisplay}`;
    const description = `${machine.description.slice(0, 155)}... | ${machine.city}, ${machine.state} | ${CATEGORIES[machine.category]}`;
    const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mercadomaquina.com'}/machine/${machine.id}`;

    return {
      title,
      description,
      keywords: [
        machine.name,
        machine.manufacturer,
        machine.model,
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
        url,
        siteName: 'Mercado Máquina',
        images: [
          {
            url: machine.images[0] || '/logo.svg',
            width: 1200,
            height: 630,
            alt: machine.name,
          },
        ],
        locale: 'pt_BR',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [machine.images[0] || '/logo.svg'],
      },
      alternates: {
        canonical: url,
      },
    };
  } catch (error) {
    return {
      title: 'Mercado Máquina',
    };
  }
}

export default function MachineDetailsPage({ params }: Props) {
  return <MachineDetailsClient params={params} />;
}
