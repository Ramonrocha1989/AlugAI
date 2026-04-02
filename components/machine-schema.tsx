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
    "brand": machine.manufacturer || "Não informado",
    "model": machine.model || machine.name,
    "productionDate": machine.yearModel?.toString(),
    "category": machine.category,
    "offers": {
      "@type": "Offer",
      "price": machine.price,
      "priceCurrency": "BRL",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 dias
      "seller": {
        "@type": "Organization",
        "name": machine.ownerName || "BaitaBriq"
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
      ...(machine.city && machine.state ? [{
        "@type": "PropertyValue",
        "name": "Localização", 
        "value": `${machine.city}, ${machine.state}`
      }] : [])
    ],
    "aggregateRating": machine.isVerifiedSeller ? {
      "@type": "AggregateRating",
      "ratingValue": 4.5,
      "ratingCount": 10
    } : undefined
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}