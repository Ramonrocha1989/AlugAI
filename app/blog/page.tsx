import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { BlogListSchema } from '@/components/blog-schema';
import { Breadcrumbs } from '@/components/breadcrumbs';

// Permitir renderização dinâmica para melhor indexação
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Blog - Dicas sobre Máquinas Agrícolas | BaitaBriq',
  description: 'Dicas, guias e novidades sobre máquinas agrícolas. Como escolher tratores, manutenção de colheitadeiras, financiamento rural e muito mais.',
  keywords: [
    'blog máquinas agrícolas',
    'dicas tratores',
    'manutenção colheitadeiras',
    'financiamento rural',
    'agricultura sustentável',
    'tecnologia agrícola',
    'tratores usados RS SC PR',
    'colheitadeiras usadas sul brasil',
    'implementos agrícolas dicas',
    'John Deere Case IH New Holland'
  ],
  openGraph: {
    title: 'Blog BaitaBriq - Dicas sobre Máquinas Agrícolas',
    description: 'Guias completos sobre tratores, colheitadeiras e implementos agrícolas no Sul do Brasil',
    type: 'website',
    locale: 'pt_BR'
  },
  alternates: {
    canonical: '/blog'
  }
};

const blogPosts = [
  {
    slug: 'como-escolher-trator-usado',
    title: 'Como Escolher o Trator Usado Ideal para sua Propriedade',
    excerpt: 'Guia completo com tudo que você precisa saber antes de comprar um trator usado. Potência, horas de uso, manutenção e muito mais.',
    date: '2024-03-15',
    readTime: '8 min',
    category: 'Tratores'
  },
  {
    slug: 'manutencao-colheitadeira-safra',
    title: 'Manutenção de Colheitadeira: Prepare-se para a Safra',
    excerpt: 'Checklist completo de manutenção preventiva para colheitadeiras. Garanta máxima eficiência na colheita.',
    date: '2024-03-10',
    readTime: '6 min',
    category: 'Colheitadeiras'
  },
  {
    slug: 'financiamento-maquinas-agricolas-2024',
    title: 'Financiamento de Máquinas Agrícolas em 2024',
    excerpt: 'Conheça as melhores opções de financiamento para máquinas agrícolas. Pronaf, bancos privados e cooperativas.',
    date: '2024-03-05',
    readTime: '10 min',
    category: 'Financiamento'
  },
  {
    slug: 'tecnologia-agricultura-precisao',
    title: 'Tecnologia na Agricultura: GPS e Agricultura de Precisão',
    excerpt: 'Como a tecnologia está revolucionando a agricultura. GPS, sensores e agricultura de precisão explicados.',
    date: '2024-02-28',
    readTime: '7 min',
    category: 'Tecnologia'
  }
];

export default function BlogPage() {
  const breadcrumbItems = [
    { name: 'Início', href: '/' },
    { name: 'Blog', href: '/blog' }
  ];

  return (
    <>
      <BlogListSchema posts={blogPosts} />
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} />
        
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao início
            </Button>
          </Link>
          
          <h1 className="text-4xl font-bold mb-4">Blog BaitaBriq</h1>
          <p className="text-lg text-muted-foreground">
            Dicas, guias e novidades sobre máquinas agrícolas para produtores rurais do Sul do Brasil.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Card key={post.slug} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.date).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </div>
                </div>
                <CardTitle className="text-xl">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`}>
                  <Button variant="outline" size="sm">
                    Ler mais →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Categorias do Blog</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <h3 className="font-medium">🚜 Tratores</h3>
              <p className="text-muted-foreground">Dicas de compra e uso</p>
            </div>
            <div>
              <h3 className="font-medium">🌾 Colheitadeiras</h3>
              <p className="text-muted-foreground">Manutenção e operação</p>
            </div>
            <div>
              <h3 className="font-medium">💰 Financiamento</h3>
              <p className="text-muted-foreground">Crédito rural e opções</p>
            </div>
            <div>
              <h3 className="font-medium">🔧 Tecnologia</h3>
              <p className="text-muted-foreground">Inovações agrícolas</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}