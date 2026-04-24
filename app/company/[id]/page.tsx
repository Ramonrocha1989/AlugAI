'use client';

import { useCompany, useCompanyMachines } from '@/hooks/use-api';
import { MachineCard } from '@/components/machine-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, MapPin, Star, Calendar, MessageCircle, Globe, Crown, Shield, Clock, Tag } from 'lucide-react';
import Image from 'next/image';

interface CompanyProfileProps {
  params: { id: string };
}

export default function CompanyProfile({ params }: CompanyProfileProps) {
  const { data: company, isLoading: companyLoading, error: companyError } = useCompany(params.id);
  const { data: machines, isLoading: machinesLoading } = useCompanyMachines(params.id);

  const handleWhatsApp = () => {
    if (!company?.phone) return;
    const cleanPhone = company.phone.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Olá! Vi o perfil da empresa *${company.company_name || 'sua empresa'}* no *BaitaBriq* e gostaria de mais informações sobre as máquinas disponíveis.`
    );
    window.open(`https://wa.me/${cleanPhone.startsWith('55') ? cleanPhone : '55' + cleanPhone}?text=${message}`, '_blank');
  };

  if (companyLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (companyError || (!companyLoading && !company)) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Empresa não encontrada</h1>
        <p className="text-gray-600">A empresa que você está procurando não existe.</p>
      </div>
    );
  }

  const isPremiumStore = company?.plan === 'premium';
  const isProfissional = company?.plan === 'profissional' || isPremiumStore;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Banner */}
      {company?.banner && isProfissional && (
        <div className="relative w-full h-[200px] md:h-[300px] rounded-lg overflow-hidden mb-6">
          <Image src={company.banner} alt="Banner" fill className="object-cover" />
          {isPremiumStore && (
            <div className="absolute top-4 right-4">
              <Badge variant="planPremium" className="flex items-center gap-1 px-3 py-1">
                <Crown className="h-4 w-4" /> Loja Premium
              </Badge>
            </div>
          )}
        </div>
      )}

      {/* Header da Empresa */}
      <Card className={`mb-8 ${isPremiumStore ? 'border-amber-300 shadow-lg' : ''}`}>
        {isPremiumStore && !company?.banner && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-3 border-b border-amber-200 flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-600" />
            <span className="font-semibold text-amber-800">Loja Premium</span>
            <Badge variant="planPremium" className="ml-2">Verificada</Badge>
          </div>
        )}
        <CardContent className="pt-6">
          <div className="flex items-start gap-5">
            {/* Logo */}
            {company?.logo && (
              <div className="relative w-20 h-20 rounded-lg overflow-hidden border flex-shrink-0">
                <Image src={company.logo} alt={company.company_name ?? ''} fill className="object-contain" />
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-3xl font-bold">{company?.company_name}</h1>
                {company?.is_verified && (
                  <Badge className="bg-green-500 text-white flex items-center gap-1">
                    <Shield className="h-3 w-3" /> Verificado
                  </Badge>
                )}
              </div>

              {company?.description && (
                <p className="text-muted-foreground mb-4">{company.description}</p>
              )}

              <div className="flex flex-wrap gap-4 text-sm">
                {company?.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" /> {company.location}
                  </div>
                )}
                {company?.phone && isProfissional && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" /> {company.phone}
                  </div>
                )}
                {company?.website && isPremiumStore && (
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                    <Globe className="h-4 w-4" /> {company.website}
                  </a>
                )}
                {company?.businessHours && isProfissional && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" /> {company.businessHours}
                  </div>
                )}
                {(company?.rating ?? 0) > 0 && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    {company?.rating} ({company?.total_reviews || 0} avaliações)
                  </div>
                )}
                {company?.created_at && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" /> Desde {new Date(company.created_at).getFullYear()}
                  </div>
                )}
              </div>

              {/* Categorias que trabalha */}
              {company?.categoriesWorked && company.categoriesWorked.length > 0 && isProfissional && (
                <div className="flex items-center gap-2 mt-4 flex-wrap">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  {company.categoriesWorked.map((cat: string) => (
                    <Badge key={cat} variant="secondary">
                      {cat.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Estatísticas - Premium */}
          {isPremiumStore && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold">{machines?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Máquinas ativas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{company?.total_reviews || 0}</div>
                <div className="text-sm text-muted-foreground">Avaliações</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{company?.rating || '-'}</div>
                <div className="text-sm text-muted-foreground">Nota média</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {company?.created_at ? Math.max(1, new Date().getFullYear() - new Date(company.created_at).getFullYear()) : 1}+
                </div>
                <div className="text-sm text-muted-foreground">Anos na plataforma</div>
              </div>
            </div>
          )}

          {company?.phone && (
            <div className="mt-6">
              <Button onClick={handleWhatsApp}>
                <MessageCircle className="h-4 w-4 mr-2" /> Entrar em contato via WhatsApp
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Galeria - Premium */}
      {company?.gallery && company.gallery.length > 0 && isPremiumStore && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Galeria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {company.gallery.map((url: string, i: number) => (
                <div key={i} className="relative h-40 rounded-lg overflow-hidden">
                  <Image src={url} alt={`Foto ${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Máquinas */}
      <div>
        <h2 className="text-2xl font-bold mb-6">
          Máquinas disponíveis ({machines?.length || 0})
        </h2>

        {machinesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        ) : machines && machines.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {machines.map((machine) => (
              <MachineCard key={machine.id} machine={machine} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">Esta empresa ainda não possui máquinas cadastradas.</p>
          </div>
        )}
      </div>
    </div>
  );
}
