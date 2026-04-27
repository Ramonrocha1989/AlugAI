import { Metadata } from 'next';
import MachineDetailsClient from './client';
import { ErrorBoundary } from '@/components/error-boundary';
import { machineService } from '@/services/machine-api';
import { BUSINESS_TYPES } from '@/lib/constants';

function categoryLabel(slug: string): string {
  return slug?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Categoria';
}
import { MachineSchema } from '@/components/machine-schema';
import { Breadcrumbs } from '@/components/breadcrumbs';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const machine = await machineService.getById(id);
    
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
    const description = `${machine.description.slice(0, 155)}... | ${machine.city}, ${machine.state} | ${categoryLabel(machine.category)}`;
    const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://baitabriq.com.br'}/machine/${machine.id}`;

    return {
      title,
      description,
      keywords: [
        machine.name,
        machine.manufacturer,
        machine.model,
        categoryLabel(machine.category),
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
        siteName: 'BaitaBriq',
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
      title: 'BaitaBriq',
    };
  }
}

export default async function MachineDetailsPage({ params }: Props) {
  const { id } = await params;
  const machine = await machineService.getById(id);
  
  if (!machine) {
    return <div>Máquina não encontrada</div>;
  }

  const breadcrumbItems = [
    { name: 'Início', href: '/' },
    { name: categoryLabel(machine.category), href: `/?category=${machine.category}` },
    { name: machine.name, href: `/machine/${machine.id}` }
  ];
  
  return (
    <>
      <MachineSchema machine={machine} />
      <div className="container mx-auto px-4 py-4">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      <ErrorBoundary>
        <MachineDetailsClient params={{ id }} />
      </ErrorBoundary>
    </>
  );
}
