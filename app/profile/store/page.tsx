'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/machine-api';
import { useCategories } from '@/hooks/use-categories';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { useToast } from '@/components/toast-provider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ImageUpload } from '@/components/image-upload';
import {
  Loader2, Save, ArrowLeft, Upload, Lock, Crown, Star, Zap,
  Image as ImageIcon, X,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { PlanId } from '@/types';

const PLAN_LEVELS: Record<string, number> = { free: 0, basico: 1, profissional: 2, premium: 3 };

function hasAccess(userPlan: string, requiredPlan: string): boolean {
  return (PLAN_LEVELS[userPlan] || 0) >= (PLAN_LEVELS[requiredPlan] || 0);
}

function LockedField({ plan, children }: { plan: string; children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="opacity-40 pointer-events-none">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg">
        <Link href="/pricing">
          <Button variant="outline" size="sm" className="gap-1">
            <Lock className="h-3 w-3" /> Disponível no plano {plan}
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function StoreProfilePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { categoriesMap } = useCategories();
  const [uploading, setUploading] = useState<string | null>(null);

  const user = authService.getCurrentUser();
  const userPlan = (user?.plan || 'free') as PlanId;

  const { data: company, isLoading } = useQuery({
    queryKey: ['my-company'],
    queryFn: () => authService.getMyCompany(),
  });

  const [form, setForm] = useState<any>(null);

  // Sincronizar form com dados do backend (uma vez)
  if (company && !form) {
    setForm({
      description: company.description || '',
      location: company.location || '',
      phone: company.phone || '',
      logo: company.logo || '',
      banner: company.banner || '',
      website: company.website || '',
      businessHours: company.businessHours || '',
      categoriesWorked: company.categoriesWorked || [],
      gallery: company.gallery || [],
    });
  }

  const update = useMutation({
    mutationFn: (data: any) => authService.updateCompanyProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-company'] });
      showToast('Perfil da loja atualizado!', 'success');
    },
    onError: (error: any) => {
      showToast(error.response?.data?.message || 'Erro ao atualizar perfil', 'error');
    },
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast('Imagem muito grande (máx 5MB)', 'error'); return; }
    setUploading(field);
    try {
      const url = await uploadToCloudinary(file);
      setForm((prev: any) => ({ ...prev, [field]: url }));
    } catch { showToast('Erro ao fazer upload', 'error'); }
    finally { setUploading(null); }
  };

  const handleSave = () => {
    update.mutate(form);
  };

  const toggleCategory = (slug: string) => {
    setForm((prev: any) => ({
      ...prev,
      categoriesWorked: prev.categoriesWorked.includes(slug)
        ? prev.categoriesWorked.filter((c: string) => c !== slug)
        : [...prev.categoriesWorked, slug],
    }));
  };

  if (isLoading || !form) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const planIcon = userPlan === 'premium' ? <Crown className="h-4 w-4" /> :
    userPlan === 'profissional' ? <Star className="h-4 w-4" /> :
    userPlan === 'basico' ? <Zap className="h-4 w-4" /> : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
      </Button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Perfil da Loja</h1>
          <p className="text-muted-foreground">Personalize como sua empresa aparece no site</p>
        </div>
        <Badge variant={userPlan === 'premium' ? 'planPremium' : userPlan === 'profissional' ? 'profissional' : userPlan === 'basico' ? 'basico' : 'secondary'} className="flex items-center gap-1">
          {planIcon} {userPlan === 'free' ? 'Gratuito' : userPlan.charAt(0).toUpperCase() + userPlan.slice(1)}
        </Badge>
      </div>

      {/* Informações básicas - todos os planos */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
          <CardDescription>Disponível em todos os planos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Descrição da empresa</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Conte sobre sua empresa, experiência, especialidades..."
              rows={4}
              className="mt-2"
            />
          </div>
          <div>
            <Label>Localização</Label>
            <Input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Ex: Pelotas, RS"
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Logo - Básico+ */}
      {hasAccess(userPlan, 'basico') ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">Logo da Empresa <Badge variant="basico">Básico+</Badge></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              {form.logo ? (
                <div className="relative">
                  <Image src={form.logo} alt="Logo" width={96} height={96} className="w-24 h-24 object-contain rounded-lg border" />
                  <button onClick={() => setForm({ ...form, logo: '' })} className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 bg-muted rounded-lg border-2 border-dashed flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <label className="cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, 'logo')} disabled={uploading === 'logo'} />
                <Button type="button" variant="outline" asChild>
                  <span>{uploading === 'logo' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />} {form.logo ? 'Trocar logo' : 'Enviar logo'}</span>
                </Button>
              </label>
            </div>
          </CardContent>
        </Card>
      ) : (
        <LockedField plan="Básico">
          <Card className="mb-6">
            <CardHeader><CardTitle>Logo da Empresa</CardTitle></CardHeader>
            <CardContent><div className="w-24 h-24 bg-muted rounded-lg" /></CardContent>
          </Card>
        </LockedField>
      )}

      {/* Banner + Telefone + Horário + Categorias - Profissional+ */}
      {hasAccess(userPlan, 'profissional') ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">Perfil Profissional <Badge variant="profissional">Profissional+</Badge></CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Banner */}
            <div>
              <Label>Banner da loja (imagem de capa)</Label>
              {form.banner ? (
                <div className="relative mt-2 h-[150px] w-full overflow-hidden rounded-lg border">
                  <Image src={form.banner} alt="Banner" fill className="object-cover" sizes="(max-width: 768px) 100vw, 896px" />
                  <button onClick={() => setForm({ ...form, banner: '' })} className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block mt-2">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, 'banner')} disabled={uploading === 'banner'} />
                  <div className="w-full h-[150px] bg-muted rounded-lg border-2 border-dashed flex items-center justify-center hover:bg-muted/80 transition-colors">
                    {uploading === 'banner' ? <Loader2 className="h-6 w-6 animate-spin" /> : <><Upload className="h-6 w-6 text-muted-foreground mr-2" /> <span className="text-muted-foreground">Enviar banner</span></>}
                  </div>
                </label>
              )}
            </div>

            <div>
              <Label>Telefone/WhatsApp público</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="5553984590461"
                className="mt-2"
              />
            </div>

            <div>
              <Label>Horário de funcionamento</Label>
              <Input
                value={form.businessHours}
                onChange={(e) => setForm({ ...form, businessHours: e.target.value })}
                placeholder="Seg-Sex 8h-18h, Sáb 8h-12h"
                className="mt-2"
              />
            </div>

            <div>
              <Label>Categorias que trabalha</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(categoriesMap).map(([slug, name]) => (
                  <Button
                    key={slug}
                    type="button"
                    variant={form.categoriesWorked.includes(slug) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleCategory(slug)}
                  >
                    {name}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <LockedField plan="Profissional">
          <Card className="mb-6">
            <CardHeader><CardTitle>Perfil Profissional</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground">Banner, telefone, horário e categorias</p></CardContent>
          </Card>
        </LockedField>
      )}

      {/* Website + Galeria - Premium */}
      {hasAccess(userPlan, 'premium') ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">Loja Premium <Badge variant="planPremium">Premium</Badge></CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Website</Label>
              <Input
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="https://minhaempresa.com.br"
                className="mt-2"
              />
            </div>

            <div>
              <Label>Galeria de fotos da empresa (até 10)</Label>
              <ImageUpload
                images={form.gallery}
                onChange={(images) => setForm({ ...form, gallery: images })}
                maxImages={10}
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <LockedField plan="Premium">
          <Card className="mb-6">
            <CardHeader><CardTitle>Loja Premium</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground">Website e galeria de fotos</p></CardContent>
          </Card>
        </LockedField>
      )}

      {/* Botão salvar */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.back()}>Cancelar</Button>
        <Button onClick={handleSave} disabled={update.isPending}>
          {update.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Salvar Perfil
        </Button>
      </div>
    </div>
  );
}
