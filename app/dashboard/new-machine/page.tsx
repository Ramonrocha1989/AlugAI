'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateMachine } from '@/hooks/use-machines';
import { authService } from '@/services/machine-api';
import { createMachineSchema, CreateMachineFormData } from '@/lib/validations-machine';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { CATEGORIES, BUSINESS_TYPES, ALL_MANUFACTURERS, STATES_SUL, QUICK_TAGS } from '@/lib/constants';

export default function NewMachinePage() {
  const router = useRouter();
  const createMachine = useCreateMachine();
  const [imageUrl, setImageUrl] = useState('');

  const form = useForm<CreateMachineFormData>({
    resolver: zodResolver(createMachineSchema),
    defaultValues: {
      images: [],
      quickTags: [],
      acceptsTradeDown: false,
      acceptsTradeUp: false,
      acceptsGrains: false,
      acceptsFinancing: false,
    },
  });

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      router.push('/login');
    }
  }, [router]);

  const onSubmit = async (data: CreateMachineFormData) => {
    try {
      await createMachine.mutateAsync(data);
      router.push('/dashboard');
    } catch (error) {
      alert('Erro ao cadastrar máquina');
    }
  };

  const handleAddImage = () => {
    if (imageUrl) {
      const currentImages = form.getValues('images') || [];
      if (currentImages.length < 10) {
        form.setValue('images', [...currentImages, imageUrl]);
        setImageUrl('');
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const currentImages = form.getValues('images') || [];
    form.setValue('images', currentImages.filter((_, i) => i !== index));
  };

  const toggleQuickTag = (tag: string) => {
    const currentTags = form.getValues('quickTags') || [];
    if (currentTags.includes(tag as any)) {
      form.setValue('quickTags', currentTags.filter(t => t !== tag) as any);
    } else {
      form.setValue('quickTags', [...currentTags, tag] as any);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Anunciar Máquina</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Tipo de Negócio */}
            <div>
              <Label>Tipo de Negócio</Label>
              <select
                {...form.register('businessType')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Selecione...</option>
                {Object.entries(BUSINESS_TYPES).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              {form.formState.errors.businessType && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.businessType.message}
                </p>
              )}
            </div>

            {/* Categoria */}
            <div>
              <Label>Categoria</Label>
              <select
                {...form.register('category')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Selecione...</option>
                {Object.entries(CATEGORIES).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              {form.formState.errors.category && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.category.message}
                </p>
              )}
            </div>

            {/* Fabricante e Modelo */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Fabricante</Label>
                <select
                  {...form.register('manufacturer')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Selecione...</option>
                  {ALL_MANUFACTURERS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                {form.formState.errors.manufacturer && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.manufacturer.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Modelo</Label>
                <Input {...form.register('model')} placeholder="Ex: 6125J" />
                {form.formState.errors.model && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.model.message}
                  </p>
                )}
              </div>
            </div>

            {/* Nome */}
            <div>
              <Label>Nome do Anúncio</Label>
              <Input
                {...form.register('name')}
                placeholder="Ex: Trator John Deere 6125J"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            {/* Descrição */}
            <div>
              <Label>Descrição (mínimo 50 caracteres)</Label>
              <Textarea
                {...form.register('description')}
                placeholder="Descreva as características, estado de conservação, histórico de uso..."
                rows={5}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            {/* Dados Técnicos */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Ano</Label>
                <Input
                  type="number"
                  {...form.register('yearModel', { valueAsNumber: true })}
                  placeholder="2020"
                />
                {form.formState.errors.yearModel && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.yearModel.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Potência (cv)</Label>
                <Input
                  type="number"
                  {...form.register('power', { valueAsNumber: true })}
                  placeholder="125"
                />
              </div>

              <div>
                <Label>Horas Motor</Label>
                <Input
                  type="number"
                  {...form.register('engineHours', { valueAsNumber: true })}
                  placeholder="3200"
                />
              </div>
            </div>

            {/* Preço */}
            <div>
              <Label>Preço (R$)</Label>
              <Input
                type="number"
                {...form.register('price', { valueAsNumber: true })}
                placeholder="285000"
              />
              {form.formState.errors.price && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.price.message}
                </p>
              )}
            </div>

            {/* Localização */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Estado</Label>
                <select
                  {...form.register('state')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Selecione...</option>
                  {STATES_SUL.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                {form.formState.errors.state && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.state.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Cidade</Label>
                <Input {...form.register('city')} placeholder="Passo Fundo" />
                {form.formState.errors.city && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.city.message}
                  </p>
                )}
              </div>
            </div>

            {/* Opções de Negociação */}
            <div>
              <Label>Opções de Negociação</Label>
              <div className="space-y-2 mt-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" {...form.register('acceptsTradeDown')} />
                  <span className="text-sm">Aceita troca por máquina de menor valor</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" {...form.register('acceptsTradeUp')} />
                  <span className="text-sm">Aceita troca por máquina de maior valor</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" {...form.register('acceptsGrains')} />
                  <span className="text-sm">Aceita grãos como pagamento</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" {...form.register('acceptsFinancing')} />
                  <span className="text-sm">Aceita financiamento</span>
                </label>
              </div>
            </div>

            {/* Tags Rápidas */}
            <div>
              <Label>Destaques</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(QUICK_TAGS).map(([key, label]) => (
                  <Button
                    key={key}
                    type="button"
                    variant={form.watch('quickTags')?.includes(key as any) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleQuickTag(key)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Imagens */}
            <div>
              <Label>Imagens (1 a 10)</Label>
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
              disabled={createMachine.isPending}
            >
              {createMachine.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Publicar Anúncio
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
