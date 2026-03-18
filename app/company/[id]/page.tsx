'use client';

import { useCompany, useCompanyMachines } from '@/hooks/use-api';
import { MachineCard } from '@/components/machine-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, MapPin, Star, Calendar, MessageCircle } from 'lucide-react';

interface CompanyProfileProps {
  params: {
    id: string;
  };
}

export default function CompanyProfile({ params }: CompanyProfileProps) {
  console.log('=== CompanyProfile component loaded ===');
  console.log('Params:', params);
  
  const { data: company, isLoading: companyLoading, error: companyError } = useCompany(params.id);
  const { data: machines, isLoading: machinesLoading } = useCompanyMachines(params.id);

  const handleWhatsApp = () => {
    if (!company?.phone) return;
    
    // Remove todos os caracteres não numéricos do telefone
    const cleanPhone = company.phone.replace(/\D/g, '');
    
    // Monta a mensagem
    const message = encodeURIComponent(
      `Olá! Vi o perfil da empresa *${company.company_name || 'sua empresa'}* no *BaitaBriq* e gostaria de mais informações sobre as máquinas disponíveis.`
    );
    
    // Abre o WhatsApp
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

  if (companyError) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Erro ao carregar empresa</h1>
        <p className="text-gray-600">Erro: {companyError.message}</p>
        <p className="text-sm text-gray-500 mt-2">ID buscado: {params.id}</p>
      </div>
    );
  }

  if (!companyLoading && !company) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Empresa não encontrada</h1>
        <p className="text-gray-600">A empresa que você está procurando não existe.</p>
        <p className="text-sm text-gray-500 mt-2">ID buscado: {params.id}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header da Empresa */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl">{company.company_name}</CardTitle>
        </CardHeader>
        <CardContent>
          {company.description && (
            <p className="text-gray-600 mb-6">{company.description}</p>
          )}
          
          <div className="flex flex-wrap gap-6 text-sm">
            {company.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{company.location}</span>
              </div>
            )}
            
            {company.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{company.phone}</span>
              </div>
            )}
            
            {company.rating && (
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span>{company.rating} ({company.total_reviews || 0} avaliações)</span>
              </div>
            )}
            
            {company.created_at && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Desde {new Date(company.created_at).getFullYear()}</span>
              </div>
            )}
          </div>
          
          {company.phone && (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {machines.map((machine) => (
              <MachineCard key={machine.id} machine={machine} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Esta empresa ainda não possui máquinas cadastradas.</p>
          </div>
        )}
      </div>
    </div>
  );
}