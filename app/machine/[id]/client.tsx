'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Script from 'next/script';
import { useMachine, useIncrementViews } from '@/hooks/use-machines';
import { machineService } from '@/services/machine-api';
import { useToast } from '@/components/toast-provider';
import { sanitizeHTML } from '@/lib/sanitize';
import { logger } from '@/lib/logger';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReviewsList } from '@/components/reviews-list';
import { ReviewModal } from '@/components/review-modal';
import { RatingBadge } from '@/components/rating-badge';
import { ShareButtons } from '@/components/share-buttons';
import { ImageLightbox } from '@/components/image-lightbox';
import { ProposalModal } from '@/components/proposal-modal';
import { authService } from '@/services/machine-api';
import { BUSINESS_TYPES, CATEGORIES, QUICK_TAGS } from '@/lib/constants';
import { analytics } from '@/lib/analytics';
import { 
  ArrowLeft, MessageCircle, Eye, CheckCircle2, Loader2, Star, DollarSign
} from 'lucide-react';

export default function MachineDetailsClient({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { showToast } = useToast();
  const id = params.id;
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const { data: machine, isLoading } = useMachine(id);
  const incrementViews = useIncrementViews();

  useEffect(() => {
    if (machine) {
      incrementViews.mutate(machine.id);
      analytics.trackMachineView(machine.id, machine.name, machine.category);
    }
  }, [machine?.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!machine) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Máquina não encontrada</p>
      </div>
    );
  }

  const currentUser = authService.getCurrentUser();
  const isOwner = currentUser?.id === machine.ownerId;

  const formatPrice = (price: number, businessType: string) => {
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(price);

    return businessType === 'RENTAL' ? `${formatted}/dia` : formatted;
  };

  const handleWhatsApp = async () => {
    try {
      await machineService.trackWhatsApp(machine.id);
    } catch (error) {
      logger.error('Erro ao rastrear:', error);
    }
    
    analytics.trackWhatsAppClick(machine.name, machine.price, machine.ownerName);
    
    const phone = machine.ownerPhone?.replace(/\D/g, '') || '';
    
    if (!phone) {
      showToast('Telefone do vendedor não cadastrado', 'warning');
      return;
    }
    
    const price = formatPrice(machine.price, machine.businessType);
    const message = encodeURIComponent(
      `Olá! Vi seu anúncio no *Mercado Máquina* e tenho interesse:\n\n` +
      `*${machine.name}*\n` +
      `Ano: ${machine.yearModel}\n` +
      `Preço: ${price}\n` +
      `Localização: ${machine.city}, ${machine.state}\n\n` +
      `Gostaria de mais informações!`
    );
    window.open(`https://wa.me/55${phone}?text=${message}`, '_blank');
  };

  const handleReview = () => {
    const user = authService.getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setShowReviewModal(true);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: machine.name,
    description: machine.description,
    image: machine.images,
    brand: {
      '@type': 'Brand',
      name: machine.manufacturer,
    },
    offers: {
      '@type': 'Offer',
      price: machine.price,
      priceCurrency: 'BRL',
      availability: machine.available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: machine.ownerName,
      },
    },
  };

  return (
    <>
      <Script
        id="machine-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-0">
              <div 
                className="relative h-96 w-full bg-muted cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => openLightbox(0)}
              >
                <Image
                  src={machine.images[0] || '/placeholder.jpg'}
                  alt={machine.name}
                  fill
                  className="object-cover rounded-t-lg"
                />
                {machine.isVerifiedSeller && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-2 rounded-md font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Vendedor Verificado
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/90 text-black">
                    {BUSINESS_TYPES[machine.businessType]}
                  </Badge>
                </div>
              </div>
              {machine.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 p-4">
                  {machine.images.slice(1, 5).map((img, idx) => (
                    <div 
                      key={idx} 
                      className="relative h-24 bg-muted rounded cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => openLightbox(idx + 1)}
                    >
                      <Image src={img} alt={`Imagem ${idx + 2}`} fill className="object-cover rounded" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl mb-2">{machine.name}</CardTitle>
                  <p className="text-muted-foreground">{CATEGORIES[machine.category]}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">
                    {formatPrice(machine.price, machine.businessType)}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <Eye className="h-4 w-4" />
                    {machine.views} visualizações
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Descrição</h3>
                <div 
                  className="text-muted-foreground whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(machine.description) }}
                />
              </div>

              {machine.quickTags.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Destaques</h3>
                  <div className="flex flex-wrap gap-2">
                    {machine.quickTags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {QUICK_TAGS[tag]}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Especificações Técnicas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Fabricante</p>
                  <p className="font-semibold">{machine.manufacturer}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Modelo</p>
                  <p className="font-semibold">{machine.model}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ano</p>
                  <p className="font-semibold">{machine.yearModel}</p>
                </div>
                {machine.power && (
                  <div>
                    <p className="text-sm text-muted-foreground">Potência</p>
                    <p className="font-semibold">{machine.power} cv</p>
                  </div>
                )}
                {machine.engineHours !== undefined && (
                  <div>
                    <p className="text-sm text-muted-foreground">Horas de Motor</p>
                    <p className="font-semibold">{machine.engineHours.toLocaleString('pt-BR')}h</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Localização</p>
                  <p className="font-semibold">{machine.city}, {machine.state}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Avaliações</CardTitle>
            </CardHeader>
            <CardContent>
              <ReviewsList machineId={machine.id} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Vendedor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <button 
                    onClick={() => router.push(`/profile/${machine.ownerId}`)}
                    className="font-semibold text-lg hover:text-primary transition-colors"
                  >
                    {machine.ownerName}
                  </button>
                  <RatingBadge userId={machine.ownerId} />
                </div>
                <p className="text-sm text-muted-foreground">{machine.owner.email}</p>
              </div>

              <Button 
                onClick={() => router.push(`/profile/${machine.ownerId}`)}
                variant="outline" 
                className="w-full"
              >
                Ver Perfil do Vendedor
              </Button>

              <Button onClick={handleWhatsApp} variant="outline" className="w-full" size="lg">
                <MessageCircle className="h-5 w-5 mr-2" />
                Falar no WhatsApp
              </Button>

              {!isOwner && (
                <Button 
                  onClick={() => setShowProposalModal(true)} 
                  variant="default" 
                  className="w-full"
                  size="lg"
                >
                  <DollarSign className="h-5 w-5 mr-2" />
                  Fazer Proposta
                </Button>
              )}

              {!isOwner && (
                <Button onClick={handleReview} variant="outline" className="w-full">
                  <Star className="h-4 w-4 mr-2" />
                  Avaliar Vendedor
                </Button>
              )}

              <ShareButtons
                title={machine.name}
                description={machine.description}
                url={shareUrl}
                price={formatPrice(machine.price, machine.businessType)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Opções de Negociação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {machine.acceptsTradeDown && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Aceita troca por máquina de menor valor</span>
                </div>
              )}
              {machine.acceptsTradeUp && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Aceita troca por máquina de maior valor</span>
                </div>
              )}
              {machine.acceptsGrains && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Aceita grãos como pagamento</span>
                </div>
              )}
              {machine.acceptsFinancing && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Aceita financiamento</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <ImageLightbox
        images={machine.images}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        reviewedUserId={machine.ownerId}
        reviewedUserName={machine.ownerName}
        machineId={machine.id}
        machineName={machine.name}
      />

      <ProposalModal
        isOpen={showProposalModal}
        onClose={() => setShowProposalModal(false)}
        machineId={machine.id}
        machineName={machine.name}
        machinePrice={machine.price}
      />
    </div>
    </>
  );
}
