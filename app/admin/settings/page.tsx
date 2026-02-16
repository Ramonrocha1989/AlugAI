'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/admin-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const [newBanner, setNewBanner] = useState({ imageUrl: '', link: '' });

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: () => adminService.getSettings(),
  });

  const updateSettings = useMutation({
    mutationFn: (data: any) => adminService.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
      alert('Configurações atualizadas!');
    },
  });

  const createBanner = useMutation({
    mutationFn: (data: any) => adminService.createBanner(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
      setNewBanner({ imageUrl: '', link: '' });
    },
  });

  const deleteBanner = useMutation({
    mutationFn: (id: string) => adminService.deleteBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateSettings.mutate({
      siteName: formData.get('siteName'),
      homeTitle: formData.get('homeTitle'),
      homeDescription: formData.get('homeDescription'),
    });
  };

  const handleAddBanner = () => {
    if (newBanner.imageUrl) {
      createBanner.mutate(newBanner);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Configurações do Site</h1>
        <Link href="/admin">
          <Button variant="outline">Voltar ao Dashboard</Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informações Gerais</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="siteName">Nome do Site</Label>
              <Input
                id="siteName"
                name="siteName"
                defaultValue={settings?.siteName || ''}
              />
            </div>
            <div>
              <Label htmlFor="homeTitle">Título da Home</Label>
              <Input
                id="homeTitle"
                name="homeTitle"
                defaultValue={settings?.homeTitle || ''}
              />
            </div>
            <div>
              <Label htmlFor="homeDescription">Descrição da Home</Label>
              <Textarea
                id="homeDescription"
                name="homeDescription"
                rows={4}
                defaultValue={settings?.homeDescription || ''}
              />
            </div>
            <Button type="submit" disabled={updateSettings.isPending}>
              {updateSettings.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Alterações
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Banners</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings?.banners?.map((banner: any) => (
            <div key={banner.id} className="flex items-center gap-4 p-4 border rounded">
              <div className="flex-1">
                <p className="text-sm font-medium truncate">{banner.imageUrl}</p>
                {banner.link && (
                  <p className="text-xs text-muted-foreground">Link: {banner.link}</p>
                )}
              </div>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => deleteBanner.mutate(banner.id)}
                disabled={deleteBanner.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <div className="border-t pt-4">
            <h3 className="font-medium mb-4">Adicionar Novo Banner</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bannerImage">URL da Imagem</Label>
                <Input
                  id="bannerImage"
                  value={newBanner.imageUrl}
                  onChange={(e) => setNewBanner({ ...newBanner, imageUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label htmlFor="bannerLink">Link (opcional)</Label>
                <Input
                  id="bannerLink"
                  value={newBanner.link}
                  onChange={(e) => setNewBanner({ ...newBanner, link: e.target.value })}
                  placeholder="/promocao"
                />
              </div>
              <Button onClick={handleAddBanner} disabled={createBanner.isPending}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Banner
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
