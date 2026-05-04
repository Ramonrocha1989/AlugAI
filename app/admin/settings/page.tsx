'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/admin-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useToast } from '@/components/toast-provider';
import {
  Loader2, Trash2, Plus, Settings, CreditCard, FolderTree,
  Image as ImageIcon, Wrench, FileText, Save, Pencil, X, Upload,
} from 'lucide-react';
import { uploadToCloudinary } from '@/lib/cloudinary';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminSettingsPage() {
  const [tab, setTab] = useState('geral');

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Configurações</h1>
        <Link href="/admin">
          <Button variant="outline">Voltar ao Dashboard</Button>
        </Link>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-2">
          <TabsTrigger value="geral"><Settings className="h-4 w-4 mr-1" /> Geral</TabsTrigger>
          <TabsTrigger value="planos"><CreditCard className="h-4 w-4 mr-1" /> Planos</TabsTrigger>
          <TabsTrigger value="categorias"><FolderTree className="h-4 w-4 mr-1" /> Categorias</TabsTrigger>
          <TabsTrigger value="banners"><ImageIcon className="h-4 w-4 mr-1" /> Banners</TabsTrigger>
          <TabsTrigger value="manutencao"><Wrench className="h-4 w-4 mr-1" /> Manutenção</TabsTrigger>
          <TabsTrigger value="termos"><FileText className="h-4 w-4 mr-1" /> Termos</TabsTrigger>
        </TabsList>

        <TabsContent value="geral"><GeralTab /></TabsContent>
        <TabsContent value="planos"><PlanosTab /></TabsContent>
        <TabsContent value="categorias"><CategoriasTab /></TabsContent>
        <TabsContent value="banners"><BannersTab /></TabsContent>
        <TabsContent value="manutencao"><ManutencaoTab /></TabsContent>
        <TabsContent value="termos"><TermosTab /></TabsContent>
      </Tabs>
    </div>
  );
}

// ==================== ABA GERAL ====================
function GeralTab() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: () => adminService.getSettings(),
  });

  const update = useMutation({
    mutationFn: (data: any) => adminService.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
      queryClient.invalidateQueries({ queryKey: ['public-settings'] });
      showToast('Configurações salvas!', 'success');
    },
    onError: () => showToast('Erro ao salvar configurações', 'error'),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    update.mutate({
      siteName: fd.get('siteName'),
      homeTitle: fd.get('homeTitle'),
      homeDescription: fd.get('homeDescription'),
      whatsappSupport: fd.get('whatsappSupport'),
      phoneSupport: fd.get('phoneSupport'),
      emailSupport: fd.get('emailSupport'),
      socialLinks: {
        instagram: fd.get('instagram'),
        facebook: fd.get('facebook'),
        youtube: fd.get('youtube'),
        linkedin: fd.get('linkedin'),
      },
    });
  };

  if (isLoading) return <Loading />;

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mb-6">
        <CardHeader><CardTitle>Informações do Site</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="Nome do Site" name="siteName" defaultValue={settings?.siteName} />
          <Field label="Título da Home" name="homeTitle" defaultValue={settings?.homeTitle} />
          <div>
            <Label htmlFor="homeDescription">Descrição da Home</Label>
            <Textarea id="homeDescription" name="homeDescription" rows={3} defaultValue={settings?.homeDescription} />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader><CardTitle>Contato e Suporte</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="WhatsApp (só números)" name="whatsappSupport" defaultValue={settings?.whatsappSupport} placeholder="5553984590461" />
          <Field label="Telefone" name="phoneSupport" defaultValue={settings?.phoneSupport} placeholder="(53) 98459-0461" />
          <Field label="Email de Suporte" name="emailSupport" defaultValue={settings?.emailSupport} placeholder="contato@baitabriq.com.br" className="md:col-span-2" />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader><CardTitle>Redes Sociais</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Instagram" name="instagram" defaultValue={settings?.socialLinks?.instagram} placeholder="https://instagram.com/..." />
          <Field label="Facebook" name="facebook" defaultValue={settings?.socialLinks?.facebook} placeholder="https://facebook.com/..." />
          <Field label="YouTube" name="youtube" defaultValue={settings?.socialLinks?.youtube} placeholder="https://youtube.com/..." />
          <Field label="LinkedIn" name="linkedin" defaultValue={settings?.socialLinks?.linkedin} placeholder="https://linkedin.com/..." />
        </CardContent>
      </Card>

      <Button type="submit" disabled={update.isPending}>
        {update.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
        Salvar Configurações
      </Button>
    </form>
  );
}

// ==================== ABA PLANOS ====================
function PlanosTab() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: plans, isLoading } = useQuery({
    queryKey: ['admin', 'plans'],
    queryFn: () => adminService.getPlans(),
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminService.updatePlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'plans'] });
      setEditingId(null);
      showToast('Plano atualizado!', 'success');
    },
    onError: () => showToast('Erro ao atualizar plano', 'error'),
  });

  const handleSave = (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    update.mutate({
      id,
      data: {
        name: fd.get('name'),
        price: Number(fd.get('price')),
        maxAds: Number(fd.get('maxAds')),
        maxPhotos: Number(fd.get('maxPhotos')),
        maxVideos: Number(fd.get('maxVideos')),
        adDuration: Number(fd.get('adDuration')),
        maxPremiumAds: Number(fd.get('maxPremiumAds')),
        maxFeaturedAds: Number(fd.get('maxFeaturedAds')),
      },
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Alterações nos planos afetam apenas novos assinantes. Usuários existentes mantêm os limites atuais.
      </p>
      {(Array.isArray(plans) ? plans : []).map((plan: any) => (
        <Card key={plan.id}>
          <CardContent className="p-6">
            {editingId === plan.id ? (
              <form onSubmit={(e) => handleSave(e, plan.id)} className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Field label="Nome" name="name" defaultValue={plan.name} />
                  <Field label="Preço (R$)" name="price" type="number" defaultValue={plan.price} />
                  <Field label="Máx. Anúncios" name="maxAds" type="number" defaultValue={plan.maxAds} />
                  <Field label="Máx. Fotos" name="maxPhotos" type="number" defaultValue={plan.maxPhotos} />
                  <Field label="Máx. Vídeos" name="maxVideos" type="number" defaultValue={plan.maxVideos} />
                  <Field label="Duração Anúncio (dias)" name="adDuration" type="number" defaultValue={plan.adDuration} />
                  <Field label="Máx. Premium" name="maxPremiumAds" type="number" defaultValue={plan.maxPremiumAds} />
                  <Field label="Máx. Destaque" name="maxFeaturedAds" type="number" defaultValue={plan.maxFeaturedAds} />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm" disabled={update.isPending}>
                    {update.isPending ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Save className="h-3 w-3 mr-1" />}
                    Salvar
                  </Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => setEditingId(null)}>Cancelar</Button>
                </div>
              </form>
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{plan.name}</h3>
                    <Badge variant="secondary">{plan.price === 0 ? 'Grátis' : `R$ ${plan.price}/mês`}</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-1 text-sm text-muted-foreground">
                    <span>Anúncios: {plan.maxAds}</span>
                    <span>Fotos: {plan.maxPhotos}</span>
                    <span>Vídeos: {plan.maxVideos}</span>
                    <span>Duração: {plan.adDuration === -1 ? 'Enquanto pago' : `${plan.adDuration} dias`}</span>
                    <span>Premium: {plan.maxPremiumAds}</span>
                    <span>Destaque: {plan.maxFeaturedAds}</span>
                    <span>Analytics: {plan.analyticsLevel || 'none'}</span>
                    <span>Suporte: {plan.supportLevel}</span>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => setEditingId(plan.id)}>
                  <Pencil className="h-4 w-4 mr-1" /> Editar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ==================== ABA CATEGORIAS ====================
function CategoriasTab() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [showNew, setShowNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [newIconUrl, setNewIconUrl] = useState('');
  const [editIconUrl, setEditIconUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: () => adminService.getCategories(),
  });

  const create = useMutation({
    mutationFn: (data: any) => adminService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setShowNew(false);
      setNewIconUrl('');
      showToast('Categoria criada!', 'success');
    },
    onError: () => showToast('Erro ao criar categoria', 'error'),
  });

  const updateCat = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setEditingId(null);
      setEditIconUrl('');
      showToast('Categoria atualizada!', 'success');
    },
    onError: () => showToast('Erro ao atualizar categoria', 'error'),
  });

  const deleteCat = useMutation({
    mutationFn: (id: string) => adminService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setDeleteId(null);
      showToast('Categoria removida!', 'success');
    },
    onError: () => showToast('Erro ao remover categoria', 'error'),
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'new' | 'edit') => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast('Imagem muito grande (máx 5MB)', 'error'); return; }
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      if (target === 'new') setNewIconUrl(url);
      else setEditIconUrl(url);
    } catch { showToast('Erro ao fazer upload', 'error'); }
    finally { setUploading(false); }
  };

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get('name') as string;
    create.mutate({
      name,
      slug: name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      icon: newIconUrl,
      isActive: true,
    });
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>, cat: any) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get('name') as string;
    updateCat.mutate({
      id: cat.id,
      data: {
        name,
        slug: name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        icon: editIconUrl || cat.icon,
        isActive: true,
      },
    });
  };

  if (isLoading) return <Loading />;

  const cats = Array.isArray(categories) ? categories : [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{cats.length} categoria{cats.length !== 1 ? 's' : ''}</p>
        <Button size="sm" onClick={() => setShowNew(true)} disabled={showNew}>
          <Plus className="h-4 w-4 mr-1" /> Nova Categoria
        </Button>
      </div>

      {showNew && (
        <Card>
          <CardContent className="p-4">
            <form onSubmit={handleCreate} className="space-y-3">
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <Label>Nome</Label>
                  <Input name="name" placeholder="Ex: Drones Agrícolas" required />
                </div>
                <div>
                  <Label>Ícone</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {newIconUrl ? (
                      <Image src={newIconUrl} alt="" width={40} height={40} className="w-10 h-10 object-contain rounded border" />
                    ) : (
                      <div className="w-10 h-10 bg-muted rounded border flex items-center justify-center">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <label className="cursor-pointer">
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, 'new')} disabled={uploading} />
                      <Button type="button" size="sm" variant="outline" asChild>
                        <span>{uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}</span>
                      </Button>
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={create.isPending || !newIconUrl}>
                  {create.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Criar'}
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={() => { setShowNew(false); setNewIconUrl(''); }}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {cats.map((cat: any) => (
        <Card key={cat.id}>
          <CardContent className="p-4">
            {editingId === cat.id ? (
              <form onSubmit={(e) => handleUpdate(e, cat)} className="space-y-3">
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <Label>Nome</Label>
                    <Input name="name" defaultValue={cat.name} required />
                  </div>
                  <div>
                    <Label>Ícone</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Image src={editIconUrl || cat.icon} alt="" width={40} height={40} className="w-10 h-10 object-contain rounded border" />
                      <label className="cursor-pointer">
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, 'edit')} disabled={uploading} />
                        <Button type="button" size="sm" variant="outline" asChild>
                          <span>{uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}</span>
                        </Button>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm" disabled={updateCat.isPending}>
                    {updateCat.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <><Save className="h-3 w-3 mr-1" /> Salvar</>}
                  </Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => { setEditingId(null); setEditIconUrl(''); }}>
                    Cancelar
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {cat.icon && cat.icon.startsWith('http') ? (
                    <Image src={cat.icon} alt={cat.name} width={40} height={40} className="w-10 h-10 object-contain" />
                  ) : (
                    <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                  <span className="font-medium">{cat.name}</span>
                  <Badge variant="secondary">{cat.slug}</Badge>
                  {cat.machineCount !== undefined && (
                    <span className="text-sm text-muted-foreground">{cat.machineCount} máquinas</span>
                  )}
                  {!cat.isActive && <Badge variant="destructive">Inativa</Badge>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setEditingId(cat.id); setEditIconUrl(''); }}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => setDeleteId(cat.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {deleteId && (
        <ConfirmDialog
          open={true}
          onOpenChange={(open) => { if (!open) setDeleteId(null); }}
          title="Remover categoria"
          description="Tem certeza que deseja remover esta categoria? Máquinas associadas ficarão sem categoria."
          confirmLabel="Remover"
          variant="destructive"
          loading={deleteCat.isPending}
          onConfirm={() => deleteCat.mutate(deleteId)}
        />
      )}
    </div>
  );
}

// ==================== ABA BANNERS ====================
function BannersTab() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [newBannerUrl, setNewBannerUrl] = useState('');
  const [newBannerLink, setNewBannerLink] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: () => adminService.getSettings(),
  });

  const create = useMutation({
    mutationFn: (data: any) => adminService.createBanner(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      setNewBannerUrl('');
      setNewBannerLink('');
      showToast('Banner adicionado!', 'success');
    },
    onError: () => showToast('Erro ao adicionar banner', 'error'),
  });

  const remove = useMutation({
    mutationFn: (id: string) => adminService.deleteBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      setDeleteId(null);
      showToast('Banner removido!', 'success');
    },
    onError: () => showToast('Erro ao remover banner', 'error'),
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast('Imagem muito grande (máx 5MB)', 'error'); return; }
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setNewBannerUrl(url);
      showToast('Imagem carregada!', 'success');
    } catch { showToast('Erro ao fazer upload', 'error'); }
    finally { setUploading(false); }
  };

  const handleAdd = () => {
    if (!newBannerUrl) return;
    create.mutate({ imageUrl: newBannerUrl, link: newBannerLink || undefined });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {settings?.banners?.length || 0} banner{(settings?.banners?.length || 0) !== 1 ? 's' : ''} cadastrado{(settings?.banners?.length || 0) !== 1 ? 's' : ''}
      </p>

      {settings?.banners?.map((banner: any) => (
        <Card key={banner.id}>
          <CardContent className="p-4 flex items-center gap-4">
            {banner.imageUrl && (
              <Image src={banner.imageUrl} alt="Banner" width={96} height={56} className="w-24 h-14 object-cover rounded border" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{banner.imageUrl}</p>
              {banner.link && <p className="text-xs text-muted-foreground">Link: {banner.link}</p>}
            </div>
            <Button size="sm" variant="destructive" onClick={() => setDeleteId(banner.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader><CardTitle className="text-base">Adicionar Banner</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {/* Preview */}
          {newBannerUrl && (
            <div className="relative w-full h-[150px] rounded-lg overflow-hidden border">
              <Image src={newBannerUrl} alt="Preview" fill className="object-cover" sizes="(max-width: 768px) 100vw, 896px" />
              <button
                onClick={() => setNewBannerUrl('')}
                className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* Upload ou URL */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <label className="cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
                <Button type="button" variant="outline" asChild>
                  <span>
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                    {uploading ? 'Enviando...' : 'Upload de imagem'}
                  </span>
                </Button>
              </label>
              <span className="text-sm text-muted-foreground">ou</span>
            </div>
            <Field
              label="URL da imagem"
              value={newBannerUrl}
              onChange={(e: any) => setNewBannerUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <Field
            label="Link ao clicar (opcional)"
            value={newBannerLink}
            onChange={(e: any) => setNewBannerLink(e.target.value)}
            placeholder="/planos ou https://..."
          />

          <Button onClick={handleAdd} disabled={create.isPending || !newBannerUrl}>
            {create.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
            Adicionar Banner
          </Button>
        </CardContent>
      </Card>

      {deleteId && (
        <ConfirmDialog
          open={true}
          onOpenChange={(open) => { if (!open) setDeleteId(null); }}
          title="Remover banner"
          description="Tem certeza que deseja remover este banner?"
          confirmLabel="Remover"
          variant="destructive"
          loading={remove.isPending}
          onConfirm={() => remove.mutate(deleteId)}
        />
      )}
    </div>
  );
}

// ==================== ABA MANUTENÇÃO ====================
function ManutencaoTab() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [initialized, setInitialized] = useState(false);
  const [maintenance, setMaintenance] = useState(false);
  const [message, setMessage] = useState('');

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: () => adminService.getSettings(),
  });

  const update = useMutation({
    mutationFn: (data: any) => adminService.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
      queryClient.invalidateQueries({ queryKey: ['public-settings'] });
      showToast('Configurações de manutenção salvas!', 'success');
    },
    onError: () => showToast('Erro ao salvar', 'error'),
  });

  // Sincronizar apenas uma vez quando os dados carregam
  if (settings && !isLoading && !initialized) {
    setMaintenance(!!settings.maintenanceMode);
    setMessage(settings.maintenanceMessage || '');
    setInitialized(true);
  }

  if (isLoading) return <Loading />;

  return (
    <Card>
      <CardHeader><CardTitle>Modo Manutenção</CardTitle></CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p className="font-medium">Ativar modo manutenção</p>
            <p className="text-sm text-muted-foreground">O site ficará inacessível para usuários comuns</p>
          </div>
          <Switch
            checked={maintenance}
            onCheckedChange={setMaintenance}
          />
        </div>

        {maintenance && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            ⚠️ O site ficará em manutenção ao salvar. Apenas admins poderão acessar.
          </div>
        )}

        <div>
          <Label htmlFor="maintenanceMessage">Mensagem de manutenção</Label>
          <Textarea
            id="maintenanceMessage"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Estamos em manutenção, voltamos em breve!"
          />
        </div>

        <Button
          onClick={() => update.mutate({ maintenanceMode: maintenance, maintenanceMessage: message })}
          disabled={update.isPending}
        >
          {update.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Salvar
        </Button>
      </CardContent>
    </Card>
  );
}

// ==================== ABA TERMOS ====================
function TermosTab() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: () => adminService.getSettings(),
  });

  const update = useMutation({
    mutationFn: (data: any) => adminService.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
      queryClient.invalidateQueries({ queryKey: ['public-settings'] });
      showToast('Textos salvos!', 'success');
    },
    onError: () => showToast('Erro ao salvar', 'error'),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    update.mutate({
      termsOfUse: fd.get('termsOfUse'),
      privacyPolicy: fd.get('privacyPolicy'),
    });
  };

  if (isLoading) return <Loading />;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Termos de Uso</CardTitle></CardHeader>
        <CardContent>
          <Textarea
            name="termsOfUse"
            rows={12}
            defaultValue={settings?.termsOfUse}
            placeholder="Digite os termos de uso do site..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Política de Privacidade</CardTitle></CardHeader>
        <CardContent>
          <Textarea
            name="privacyPolicy"
            rows={12}
            defaultValue={settings?.privacyPolicy}
            placeholder="Digite a política de privacidade..."
          />
        </CardContent>
      </Card>

      <Button type="submit" disabled={update.isPending}>
        {update.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
        Salvar Textos
      </Button>
    </form>
  );
}

// ==================== COMPONENTES AUXILIARES ====================
function Loading() {
  return (
    <div className="flex justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

function Field({ label, className, ...props }: any) {
  const id = props.name || props.id || label;
  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...props} />
    </div>
  );
}
