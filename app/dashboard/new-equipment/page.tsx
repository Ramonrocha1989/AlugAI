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
import { Loader2, ArrowLeft } from 'lucide-react';

export default function NewEquipmentPage() {
  const router = useRouter();
  const createEquipment = useCreateEquipment();
  const [imageUrl, setImageUrl] = useState('');

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
      await createEquipment.mutateAsync(data);
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro:', error);
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
              <Label>Imagens (URLs)</Label>
              <div className="flex gap-2 mb-2">
                <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Cole a URL da imagem" />
                <Button type="button" onClick={handleAddImage}>Adicionar</Button>
              </div>
              {form.formState.errors.images && <p className="text-sm text-destructive mt-1">{form.formState.errors.images.message}</p>}
              {form.watch('images')?.length > 0 && (
                <div className="mt-2 space-y-2">
                  {form.watch('images').map((url, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <span className="flex-1 truncate">{url}</span>
                      <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveImage(index)}>Remover</Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={createEquipment.isPending}>
              {createEquipment.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Cadastrar Máquina
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
