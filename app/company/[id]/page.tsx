'use client';

import { useCompany, useCompanyMachines } from '@/hooks/use-api';
import { MachineCard } from '@/components/machine-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, MapPin, Star, Calendar, MessageCircle, Globe, Crown, Shield } from 'lucide-react';

interface CompanyProfileProps {
  params: {
    id: string;
  };
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
    window.open(`https://wa.me/55${cleanPhone}?text=${message}`, '_blank');
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

  // Verificar se é Premium pelo campo do company (backend precisa retornar)
  const isPremiumStore = company?.plan === 'premium';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header da Empresa */}
      <Card className={`mb-8 ${isPremiumStore ? 'border-amber-300 shadow-lg' : ''}`}>
        {isPremiumStore && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-3 border-b border-amber-200 flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-600" />
            <span className="font-semibold text-amber-800">Loja Premium</span>
            <Badge variant="planPremium" className="ml-2">Verificada</Badge>
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-3xl flex items-center gap-3">
            {company?.company_name}
            {company?.is_verified && (
              <Badge className="bg-green-500 text-white flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Verificado
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {company?.description && (
            <p className="text-gray-600 mb-6">{company.description}</p>
          )}
          
          <div className="flex flex-wrap gap-6 text-sm">
            {company?.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{company.location}</span>
              </div>
            )}
            
            {company?.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{company.phone}</span>
              </div>
            )}

            {company?.website && isPremiumStore && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-500" />
                <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {company.website}
                </a>
              </div>
            )}
            
            {company?.rating && (
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span>{company.rating} ({company.total_reviews || 0} avaliações)</span>
              </div>
            )}
            
            {company?.created_at && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Desde {new Date(company.created_at).getFullYear()}</span>
              </div>
            )}
          </div>

          {/* Estatísticas da loja - só Premium */}
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
                  {company?.created_at ? new Date().getFullYear() - new Date(company.created_at).getFullYear() : 0}+
                </div>
                <div className="text-sm text-muted-foreground">Anos na plataforma</div>
              </div>
            </div>
          )}
          
          {company?.phone && (
            <div className="mt-6">
              <Button onClick={handleWhatsApp}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Entrar em contato via WhatsApp
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Máquinas da Empresa */}
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
