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
    "brand": {
      "@type": "Brand",
      "name": machine.manufacturer
    },
    "model": machine.model,
    "productionDate": machine.yearModel?.toString(),
    "offers": {
      "@type": "Offer",
      "price": machine.price,
      "priceCurrency": "BRL",
      "availability": machine.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": machine.ownerName
      }
    },
    "location": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": machine.city,
        "addressRegion": machine.state,
        "addressCountry": "BR"
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface OrganizationSchemaProps {
  name: string;
  city: string;
  state: string;
}

export function OrganizationSchema({ name, city, state }: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": name,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": city,
      "addressRegion": state,
      "addressCountry": "BR"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "BaitaBriq",
    "url": "https://baitabriq.com.br",
    "description": "Marketplace de máquinas agrícolas usadas no Sul do Brasil",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://baitabriq.com.br/?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}