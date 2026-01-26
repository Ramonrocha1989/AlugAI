'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateEquipment } from '@/hooks/use-api';
import { authService } from '@/services/api';
import { equipmentSchema, EquipmentFormData } from '@/lib/validations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function NewEquipmentPage() {
  const router = useRouter();
  const createEquipment = useCreateEquipment();
  const [imageUrl, setImageUrl] = useState('');

  const form = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      images: [],
    },
  });

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      router.push('/login');
    }
  }, [router]);

  const onSubmit = async (data: EquipmentFormData) => {
    try {
      await createEquipment.mutateAsync(data);
      router.push('/dashboard');
    } catch (error) {
      alert('Erro ao cadastrar equipamento');
    }
  };

  const handleAddImage = () => {
    if (imageUrl) {
      const currentImages = form.getValues('images') || [];
      form.setValue('images', [...currentImages, imageUrl]);
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    const currentImages = form.getValues('images') || [];
    form.setValue('images', currentImages.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Cadastrar Novo Equipamento</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="name">Nome do Equipamento</Label>
              <Input
                id="name"
                {...form.register('name')}
                placeholder="Ex: Escavadeira Hidráulica CAT 320"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                {...form.register('description')}
                placeholder="Descreva as características e condições do equipamento"
                rows={4}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                {...form.register('category')}
                placeholder="Ex: Escavadeiras"
              />
              {form.formState.errors.category && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.category.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="dailyPrice">Preço Diário (R$)</Label>
              <Input
                id="dailyPrice"
                type="number"
                {...form.register('dailyPrice', { valueAsNumber: true })}
                placeholder="850"
              />
              {form.formState.errors.dailyPrice && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.dailyPrice.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="location">Localização</Label>
              <Input
                id="location"
                {...form.register('location')}
                placeholder="Ex: São Paulo, SP"
              />
              {form.formState.errors.location && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.location.message}
                </p>
              )}
            </div>

            <div>
              <Label>Imagens (URLs)</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Cole a URL da imagem"
                />
                <Button type="button" onClick={handleAddImage}>
                  Adicionar
                </Button>
              </div>
              {form.formState.errors.images && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.images.message}
                </p>
              )}
              {form.watch('images')?.length > 0 && (
                <div className="mt-2 space-y-2">
                  {form.watch('images').map((url, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <span className="flex-1 truncate">{url}</span>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveImage(index)}
                      >
                        Remover
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={createEquipment.isPending}
            >
              {createEquipment.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Cadastrar Equipamento
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
