import { Metadata } from 'next';
import { machineService } from '@/services/machine-api';
import { CATEGORIES } from '@/lib/constants';
import { MachineSchema } from '@/components/structured-data';
import { redirect } from 'next/navigation';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const machine = await machineService.getById(params.id);
    
    if (!machine) {
      return {
        title: 'Máquina não encontrada | BaitaBriq',
      };
    }

    const price = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(machine.price);

    const title = `${machine.name} ${machine.yearModel} - ${price} | ${machine.city}-${machine.state} | BaitaBriq`;
    const description = `${machine.name} ${machine.yearModel} em ${machine.city}-${machine.state}. ${machine.description.slice(0, 120)}... Veja fotos, detalhes técnicos e entre em contato com o vendedor.`;
    const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://baitabriq.com.br'}/equipment/${machine.id}`;

    return {
      title,
      description,
      keywords: [
        `${machine.name} usado`,
        `${machine.manufacturer} ${machine.yearModel}`,
        `${machine.name} ${machine.city}`,
        `máquinas ${machine.state}`,
        CATEGORIES[machine.category],
        machine.category.toLowerCase(),
        'máquina agrícola usada',
        `${machine.manufacturer} usado`
      ],
      openGraph: {
        title,
        description,
        url,
        siteName: 'BaitaBriq',
        images: [
          {
            url: machine.images[0] || '/logo.jpeg',
            width: 1200,
            height: 630,
            alt: `${machine.name} ${machine.yearModel}`,
          },
        ],
        locale: 'pt_BR',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [machine.images[0] || '/logo.jpeg'],
      },
      alternates: {
        canonical: url,
      },
    };
  } catch (error) {
    return {
      title: 'Máquina não encontrada | BaitaBriq',
    };
  }
}

export default async function EquipmentPage({ params }: Props) {
  // Redirect para a nova URL /machine/[id]
  redirect(`/machine/${params.id}`);
}