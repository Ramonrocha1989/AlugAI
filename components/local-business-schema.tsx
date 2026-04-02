export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "BaitaBriq",
    "alternateName": "Baita Briq",
    "description": "Marketplace líder de máquinas agrícolas usadas no Sul do Brasil. Tratores, colheitadeiras e implementos em RS, SC e PR.",
    "url": "https://baitabriq.com.br",
    "telephone": "(53) 98459-0461",
    "email": "contato@baitabriq.com.br",
    "foundingDate": "2024",
    "address": {
      "@type": "PostalAddress",
      "addressRegion": "RS",
      "addressCountry": "BR"
    },
    "areaServed": [
      {
        "@type": "State",
        "name": "Rio Grande do Sul",
        "alternateName": "RS"
      },
      {
        "@type": "State",
        "name": "Santa Catarina", 
        "alternateName": "SC"
      },
      {
        "@type": "State",
        "name": "Paraná",
        "alternateName": "PR"
      }
    ],
    "serviceType": "Marketplace de Máquinas Agrícolas",
    "knowsAbout": [
      "Tratores usados",
      "Colheitadeiras usadas", 
      "Implementos agrícolas",
      "Máquinas agrícolas John Deere",
      "Máquinas agrícolas Case IH",
      "Máquinas agrícolas New Holland"
    ],
    "sameAs": [
      "https://www.instagram.com/baitabriq",
      "https://www.facebook.com/baitabriq"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}