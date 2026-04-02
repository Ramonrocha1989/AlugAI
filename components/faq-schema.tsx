export function FAQSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Como funciona a BaitaBriq?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A BaitaBriq é um marketplace que conecta compradores e vendedores de máquinas agrícolas no Sul do Brasil. Você pode anunciar gratuitamente, negociar diretamente e encontrar as melhores oportunidades em tratores, colheitadeiras e implementos."
        }
      },
      {
        "@type": "Question",
        "name": "É seguro comprar máquinas pela BaitaBriq?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! Temos vendedores verificados, sistema de avaliações e suporte completo. Recomendamos sempre verificar a máquina pessoalmente e negociar em locais seguros."
        }
      },
      {
        "@type": "Question",
        "name": "Posso anunciar minha máquina gratuitamente?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! O plano gratuito permite anunciar até 3 máquinas. Para anúncios ilimitados e recursos premium, temos o plano Lojista por R$ 29,90/mês."
        }
      },
      {
        "@type": "Question",
        "name": "Quais regiões a BaitaBriq atende?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Atendemos todo o Sul do Brasil: Rio Grande do Sul (RS), Santa Catarina (SC) e Paraná (PR), com foco nas principais regiões agrícolas."
        }
      },
      {
        "@type": "Question",
        "name": "Que tipos de máquinas posso encontrar?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Tratores, colheitadeiras, plantadeiras, pulverizadores, implementos agrícolas e máquinas de construção. Marcas como John Deere, Case IH, New Holland, Massey Ferguson e outras."
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}