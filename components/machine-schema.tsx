import { Machine } from '@/types';

interface MachineSchemaProps {
  machine: Machine;
}

export function MachineSchema({ machine }: MachineSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": machine.name,
    "description": machine.description,
    "image": machine.images,
    "brand": machine.brand || "Não informado",
    "model": machine.model || machine.name,
    "productionDate": machine.year?.toString(),
    "category": machine.category,
    "offers": {
      "@type": "Offer",
      "price": machine.price,
      "priceCurrency": "BRL",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 dias
      "seller": {
        "@type": "Organization",
        "name": machine.seller?.name || "BaitaBriq"
      }
    },
    "additionalProperty": [
      ...(machine.engineHours ? [{
        "@type": "PropertyValue",
        "name": "Horas de Motor",
        "value": machine.engineHours.toString()
      }] : []),
      ...(machine.power ? [{
        "@type": "PropertyValue", 
        "name": "Potência",
        "value": `${machine.power} cv`
      }] : []),
      ...(machine.location ? [{
        "@type": "PropertyValue",
        "name": "Localização", 
        "value": machine.location
      }] : [])
    ],
    "aggregateRating": machine.seller?.rating ? {
      "@type": "AggregateRating",
      "ratingValue": machine.seller.rating,
      "ratingCount": machine.seller.reviewCount || 1
    } : undefined
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}