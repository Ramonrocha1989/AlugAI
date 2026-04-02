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
    "image": machine.images.length > 0 ? machine.images : ["https://baitabriq.com.br/logo.jpeg"],
    "brand": {
      "@type": "Brand",
      "name": machine.manufacturer || "Não informado"
    },
    "model": machine.model || machine.name,
    "productionDate": machine.yearModel?.toString(),
    "category": machine.category,
    "sku": machine.id,
    "offers": {
      "@type": "Offer",
      "price": machine.price.toString(),
      "priceCurrency": "BRL",
      "availability": machine.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "url": `https://baitabriq.com.br/machine/${machine.id}`,
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
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}