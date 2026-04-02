import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tractor, Wheat, MapPin, BookOpen, ArrowRight } from 'lucide-react';

export function CategorySection() {
  const categories = [
    {
      title: 'Tratores Usados',
      description: 'John Deere, Case IH, New Holland e mais',
      icon: Tractor,
      href: '/categoria/tratores',
      color: 'bg-green-50 border-green-200 hover:bg-green-100',
      iconColor: 'text-green-600',
      badge: 'Mais Procurado',
      badgeColor: 'bg-green-100 text-green-800'
    },
    {
      title: 'Colheitadeiras',
      description: 'Para soja, milho, arroz e trigo',
      icon: Wheat,
      href: '/categoria/colheitadeiras',
      color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
      iconColor: 'text-yellow-600',
      badge: 'Safra 2024',
      badgeColor: 'bg-yellow-100 text-yellow-800'
    },
    {
      title: 'Máquinas no RS',
      description: 'Pelotas, Porto Alegre, Santa Maria',
      icon: MapPin,
      href: '/maquinas/rs',
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      iconColor: 'text-blue-600',
      badge: 'Região Sul',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      title: 'Blog & Dicas',
      description: 'Guias para comprar máquinas usadas',
      icon: BookOpen,
      href: '/blog',
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      iconColor: 'text-purple-600',
      badge: 'Novo!',
      badgeColor: 'bg-purple-100 text-purple-800'
    }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">🚜 Explore por Categoria</h2>
          <p className="text-muted-foreground">
            Encontre exatamente o que você precisa
          </p>
        </div>
        <Badge variant="secondary" className="hidden md:flex">
          ✨ Páginas SEO
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => {
          const IconComponent = category.icon;
          
          return (
            <Link key={category.href} href={category.href}>
              <Card className={`${category.color} hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer h-full`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-white/50">
                      <IconComponent className={`h-6 w-6 ${category.iconColor}`} />
                    </div>
                    <Badge className={category.badgeColor}>
                      {category.badge}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2">
                    {category.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center text-sm font-medium text-primary">
                    Ver mais
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Seção de estatísticas */}
      <div className="mt-8 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">500+</div>
            <div className="text-sm text-muted-foreground">Máquinas</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">3</div>
            <div className="text-sm text-muted-foreground">Estados</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">50+</div>
            <div className="text-sm text-muted-foreground">Cidades</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">24/7</div>
            <div className="text-sm text-muted-foreground">Suporte</div>
          </div>
        </div>
      </div>
    </div>
  );
}