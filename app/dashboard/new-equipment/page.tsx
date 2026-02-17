'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateEquipment } from '@/hooks/use-api';
import { authService } from '@/services/machine-api';
import { equipmentSchema, EquipmentFormData } from '@/lib/validations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { UpgradeLimitModal } from '@/components/upgrade-limit-modal';
import { ImageUpload } from '@/components/image-upload';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function NewEquipmentPage() {
  const router = useRouter();
  const createEquipment = useCreateEquipment();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const form = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      images: [],
      businessType: 'SALE',
      acceptsTradeDown: false,
      acceptsTradeUp: false,
      acceptsGrains: false,
      acceptsFinancing: false,
      quickTags: [],
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
      // Limpar arrays de valores vazios/undefined
      const payload = {
        ...data,
        images: (data.images || []).filter(img => img && typeof img === 'string' && img.trim()),
        quickTags: (data.quickTags || []).filter(tag => tag),
      };
      
      console.log('Payload antes de enviar:', JSON.stringify(payload, null, 2));
      
      await createEquipment.mutateAsync(payload);
      router.push('/dashboard');
    } catch (error: any) {
      if (error.response?.status === 403) {
        setShowUpgradeModal(true);
      } else {
        console.error('Erro completo:', error.response?.data || error);
        alert('Erro ao cadastrar equipamento');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Cadastrar Nova Máquina</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="businessType">Tipo de Negócio</Label>
              <select id="businessType" {...form.register('businessType')} className="w-full border rounded-md p-2">
                <option value="SALE">Venda</option>
                <option value="RENTAL">Aluguel</option>
                <option value="EXCHANGE">Troca</option>
                <option value="SERVICE">Serviço</option>
              </select>
              {form.formState.errors.businessType && <p className="text-sm text-destructive mt-1">{form.formState.errors.businessType.message}</p>}
            </div>

            <div>
              <Label htmlFor="name">Nome da Máquina</Label>
              <Input id="name" {...form.register('name')} placeholder="Ex: Escavadeira Hidráulica CAT 320" />
              {form.formState.errors.name && <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" {...form.register('description')} placeholder="Descreva as características" rows={4} />
              {form.formState.errors.description && <p className="text-sm text-destructive mt-1">{form.formState.errors.description.message}</p>}
            </div>

            <div>
              <Label htmlFor="category">Categoria</Label>
              <select id="category" {...form.register('category')} className="w-full border rounded-md p-2">
                <option value="">Selecione...</option>
                <option value="TRACTORS">Tratores</option>
                <option value="HARVESTERS">Colheitadeiras</option>
                <option value="PLANTING">Plantio</option>
                <option value="SPRAYING">Pulverização</option>
                <option value="HAYMAKING">Fenação</option>
                <option value="IMPLEMENTS">Implementos</option>
                <option value="LIVESTOCK">Pecuária</option>
                <option value="CONSTRUCTION">Construção</option>
              </select>
              {form.formState.errors.category && <p className="text-sm text-destructive mt-1">{form.formState.errors.category.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="manufacturer">Fabricante</Label>
                <Input id="manufacturer" {...form.register('manufacturer')} placeholder="Ex: Caterpillar" />
                {form.formState.errors.manufacturer && <p className="text-sm text-destructive mt-1">{form.formState.errors.manufacturer.message}</p>}
              </div>
              <div>
                <Label htmlFor="model">Modelo</Label>
                <Input id="model" {...form.register('model')} placeholder="Ex: 320" />
                {form.formState.errors.model && <p className="text-sm text-destructive mt-1">{form.formState.errors.model.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="yearModel">Ano</Label>
                <Input id="yearModel" type="number" {...form.register('yearModel', { valueAsNumber: true })} placeholder="2020" />
                {form.formState.errors.yearModel && <p className="text-sm text-destructive mt-1">{form.formState.errors.yearModel.message}</p>}
              </div>
              <div>
                <Label htmlFor="price">Preço (R$)</Label>
                <Input id="price" type="number" {...form.register('price', { valueAsNumber: true })} placeholder="850000" />
                {form.formState.errors.price && <p className="text-sm text-destructive mt-1">{form.formState.errors.price.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="power">Potência (HP)</Label>
                <Input id="power" type="number" {...form.register('power', { valueAsNumber: true })} placeholder="122" />
                {form.formState.errors.power && <p className="text-sm text-destructive mt-1">{form.formState.errors.power.message}</p>}
              </div>
              <div>
                <Label htmlFor="engineHours">Horas de Uso</Label>
                <Input id="engineHours" type="number" {...form.register('engineHours', { valueAsNumber: true })} placeholder="1500" />
                {form.formState.errors.engineHours && <p className="text-sm text-destructive mt-1">{form.formState.errors.engineHours.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="serialNumber">Número de Chassi/Série</Label>
              <Input id="serialNumber" {...form.register('serialNumber')} placeholder="CAT320DL2020BR12345" />
              {form.formState.errors.serialNumber && <p className="text-sm text-destructive mt-1">{form.formState.errors.serialNumber.message}</p>}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="state">Estado (UF)</Label>
                <Input id="state" {...form.register('state')} placeholder="SP" maxLength={2} />
                {form.formState.errors.state && <p className="text-sm text-destructive mt-1">{form.formState.errors.state.message}</p>}
              </div>
              <div className="col-span-2">
                <Label htmlFor="city">Cidade</Label>
                <Input id="city" {...form.register('city')} placeholder="São Paulo" />
                {form.formState.errors.city && <p className="text-sm text-destructive mt-1">{form.formState.errors.city.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="zipCode">CEP</Label>
              <Input id="zipCode" {...form.register('zipCode')} placeholder="01310-100" />
            </div>

            <div>
              <Label htmlFor="ownerPhone">Telefone</Label>
              <Input id="ownerPhone" {...form.register('ownerPhone')} placeholder="(11) 98765-4321" />
            </div>

            <div className="space-y-2">
              <Label>Aceita</Label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" {...form.register('acceptsTradeDown')} />
                  <span className="text-sm">Troca com troco</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" {...form.register('acceptsTradeUp')} />
                  <span className="text-sm">Troca com volta</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" {...form.register('acceptsGrains')} />
                  <span className="text-sm">Grãos</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" {...form.register('acceptsFinancing')} />
                  <span className="text-sm">Financiamento</span>
                </label>
              </div>
            </div>

            <div>
              <Label>Imagens</Label>
              <ImageUpload
                images={form.watch('images') || []}
                onChange={(images) => form.setValue('images', images)}
                maxImages={5}
              />
              {form.formState.errors.images && <p className="text-sm text-destructive mt-1">{form.formState.errors.images.message}</p>}
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={createEquipment.isPending}>
              {createEquipment.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Cadastrar Máquina
            </Button>
          </form>
        </CardContent>
      </Card>

      <UpgradeLimitModal open={showUpgradeModal} onOpenChange={setShowUpgradeModal} />
    </div>
  );
}
