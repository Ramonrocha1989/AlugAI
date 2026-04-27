'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useMachine, useUpdateMachine } from '@/hooks/use-machines';
import { useToast } from '@/components/toast-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ImageUpload } from '@/components/image-upload';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { CATEGORIES, BUSINESS_TYPES, ALL_MANUFACTURERS, STATES_SUL, QUICK_TAGS } from '@/lib/constants';
import { CreateMachineData } from '@/types/machine';

export default function EditMachinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { showToast } = useToast();
  const { data: machine, isLoading } = useMachine(id);
  const updateMachine = useUpdateMachine();
  const [formData, setFormData] = useState<Partial<CreateMachineData>>({
    acceptsTradeDown: false,
    acceptsTradeUp: false,
    acceptsGrains: false,
    acceptsFinancing: false,
    images: [],
    quickTags: [],
  });

  useEffect(() => {
    if (machine) {
      setFormData({
        name: machine.name,
        description: machine.description,
        category: machine.category,
        businessType: machine.businessType,
        manufacturer: machine.manufacturer,
        model: machine.model,
        yearModel: machine.yearModel,
        engineHours: machine.engineHours,
        power: machine.power,
        serialNumber: machine.serialNumber || undefined,
        price: machine.price,
        state: machine.state,
        city: machine.city,
        zipCode: machine.zipCode || undefined,
        images: machine.images || [],
        videoUrl: machine.videoUrl || undefined,
        quickTags: machine.quickTags,
        acceptsTradeDown: machine.acceptsTradeDown,
        acceptsTradeUp: machine.acceptsTradeUp,
        acceptsGrains: machine.acceptsGrains,
        acceptsFinancing: machine.acceptsFinancing,
        ownerPhone: machine.ownerPhone?.replace(/^55/, '') || undefined,
      });
    }
  }, [machine]);

  const updateFormData = (data: Partial<CreateMachineData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const toggleQuickTag = (tag: string) => {
    const currentTags = formData.quickTags || [];
    if (currentTags.includes(tag as any)) {
      updateFormData({ quickTags: currentTags.filter(t => t !== tag) as any });
    } else {
      updateFormData({ quickTags: [...currentTags, tag] as any });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanData = Object.entries(formData).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (key === 'price') {
          acc[key] = typeof value === 'string' ? parseInt(value) || 0 : value;
        } else if (key === 'ownerPhone' && typeof value === 'string') {
          acc[key] = value.replace(/^55/, '');
        } else {
          acc[key] = value;
        }
      }
      return acc;
    }, {} as any);
    
    try {
      await updateMachine.mutateAsync({ id, data: cleanData });
      showToast('Máquina atualizada com sucesso!', 'success');
      router.push('/dashboard');
    } catch (error: any) {
      showToast(
        error.response?.status === 403
          ? 'Você não tem permissão para editar esta máquina'
          : 'Erro ao atualizar máquina',
        'error'
      );
    }
  };

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Editar Máquina</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tipo de Negócio</Label>
                <select
                  value={formData.businessType || ''}
                  onChange={(e) => updateFormData({ businessType: e.target.value as any })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-2"
                >
                  {Object.entries(BUSINESS_TYPES).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Categoria</Label>
                <select
                  value={formData.category || ''}
                  onChange={(e) => updateFormData({ category: e.target.value as any })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-2"
                >
                  {Object.entries(CATEGORIES).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Fabricante</Label>
                <select
                  value={formData.manufacturer || ''}
                  onChange={(e) => updateFormData({ manufacturer: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-2"
                >
                  {ALL_MANUFACTURERS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Modelo</Label>
                <Input
                  value={formData.model || ''}
                  onChange={(e) => updateFormData({ model: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Ano</Label>
                <Input
                  type="number"
                  value={formData.yearModel || ''}
                  onChange={(e) => updateFormData({ yearModel: parseInt(e.target.value) || 0 })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Horas de Motor</Label>
                <Input
                  type="number"
                  value={formData.engineHours || ''}
                  onChange={(e) => updateFormData({ engineHours: parseInt(e.target.value) || undefined })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Potência (cv)</Label>
                <Input
                  type="number"
                  value={formData.power || ''}
                  onChange={(e) => updateFormData({ power: parseInt(e.target.value) || undefined })}
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label>Preço (R$)</Label>
              <CurrencyInput
                value={formData.price || 0}
                onChange={(value) => updateFormData({ price: value })}
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Estado</Label>
                <select
                  value={formData.state || ''}
                  onChange={(e) => updateFormData({ state: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-2"
                >
                  {STATES_SUL.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Cidade</Label>
                <Input
                  value={formData.city || ''}
                  onChange={(e) => updateFormData({ city: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label>Descrição</Label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => updateFormData({ description: e.target.value })}
                rows={6}
                className="mt-2"
              />
            </div>

            {/* Seção de Imagens */}
            <div>
              <Label>Fotos da Máquina</Label>
              <p className="text-sm text-muted-foreground mb-3">
                📸 Você pode adicionar novas fotos ou remover as existentes clicando no X que aparece ao passar o mouse sobre cada imagem
              </p>
              <ImageUpload
                images={formData.images || []}
                onChange={(images) => updateFormData({ images })}
                maxImages={10}
              />
            </div>

            {/* Vídeo */}
            <div>
              <Label>Vídeo (opcional)</Label>
              <Input
                value={formData.videoUrl || ''}
                onChange={(e) => updateFormData({ videoUrl: e.target.value })}
                placeholder="URL do vídeo (YouTube, Vimeo, etc.)"
                className="mt-2"
              />
            </div>

            <div>
              <Label>Destaques</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(QUICK_TAGS).map(([key, label]) => (
                  <Button
                    key={key}
                    type="button"
                    variant={formData.quickTags?.includes(key as any) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleQuickTag(key)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label>Opções de Negociação</Label>
              <div className="space-y-2 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.acceptsTradeDown}
                    onChange={(e) => updateFormData({ acceptsTradeDown: e.target.checked })}
                  />
                  <span className="text-sm">Aceito troca por máquina de menor valor</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.acceptsTradeUp}
                    onChange={(e) => updateFormData({ acceptsTradeUp: e.target.checked })}
                  />
                  <span className="text-sm">Aceito troca por máquina de maior valor</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.acceptsGrains}
                    onChange={(e) => updateFormData({ acceptsGrains: e.target.checked })}
                  />
                  <span className="text-sm">Aceito grãos como pagamento</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.acceptsFinancing}
                    onChange={(e) => updateFormData({ acceptsFinancing: e.target.checked })}
                  />
                  <span className="text-sm">Aceito financiamento</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
                disabled={updateMachine.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={updateMachine.isPending}
              >
                {updateMachine.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
