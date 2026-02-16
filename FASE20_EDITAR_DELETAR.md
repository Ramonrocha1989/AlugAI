# FASE 20 - Editar/Deletar Máquinas - IMPLEMENTAÇÃO COMPLETA

## 📝 PASSO A PASSO:

### 1. Adicione no arquivo `services/machine-api.ts`

Localize a linha `incrementViews: async (id: string)` e ADICIONE ANTES do fechamento `};`:

```typescript
  update: async (id: string, data: Partial<CreateMachineData>): Promise<Machine> => {
    const { data: updatedMachine } = await api.put<Machine>(`/machines/${id}`, data);
    return updatedMachine;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/machines/${id}`);
  },
```

---

### 2. Adicione no arquivo `hooks/use-machines.ts`

No FINAL do arquivo, ADICIONE:

```typescript
// Hook para editar máquina
export function useUpdateMachine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateMachineData> }) => 
      machineService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      queryClient.invalidateQueries({ queryKey: ['my-machines'] });
    },
  });
}

// Hook para deletar máquina
export function useDeleteMachine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => machineService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      queryClient.invalidateQueries({ queryKey: ['my-machines'] });
    },
  });
}
```

---

### 3. SUBSTITUA o arquivo `app/dashboard/page.tsx` por:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMyMachines, useDeleteMachine } from '@/hooks/use-machines';
import { MachineCard } from '@/components/machine-card';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, Edit, Trash2 } from 'lucide-react';
import { authService } from '@/services/machine-api';
import { Machine } from '@/types/machine';

export default function DashboardPage() {
  const router = useRouter();
  const { data: machines, isLoading } = useMyMachines();
  const deleteMachine = useDeleteMachine();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      router.push('/login');
    }
  }, [router]);

  const handleDelete = async (machine: Machine) => {
    if (!confirm(`Tem certeza que deseja deletar "${machine.name}"?`)) {
      return;
    }

    setDeletingId(machine.id);
    try {
      await deleteMachine.mutateAsync(machine.id);
    } catch (error: any) {
      if (error.response?.status === 403) {
        alert('Você não tem permissão para deletar esta máquina');
      } else {
        alert('Erro ao deletar máquina');
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Minhas Máquinas</h1>
          <p className="text-muted-foreground">
            Gerencie seus anúncios de máquinas
          </p>
        </div>
        <Link href="/dashboard/new-machine">
          <Button size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Anunciar Máquina
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : machines && machines.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {machines.map((machine) => (
            <div key={machine.id} className="relative">
              <MachineCard machine={machine} />
              <div className="absolute top-2 left-2 flex gap-2 z-10">
                <Link href={`/dashboard/edit-machine/${machine.id}`}>
                  <Button size="sm" variant="secondary">
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(machine)}
                  disabled={deletingId === machine.id}
                >
                  {deletingId === machine.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Deletar
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted rounded-lg">
          <h3 className="text-xl font-semibold mb-2">
            Você ainda não tem máquinas cadastradas
          </h3>
          <p className="text-muted-foreground mb-6">
            Comece anunciando sua primeira máquina
          </p>
          <Link href="/dashboard/new-machine">
            <Button>
              <Plus className="h-5 w-5 mr-2" />
              Anunciar Máquina
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
```

---

### 4. CRIE a pasta e arquivo `app/dashboard/edit-machine/[id]/page.tsx`:

```bash
mkdir -p app/dashboard/edit-machine/[id]
```

Depois crie o arquivo `app/dashboard/edit-machine/[id]/page.tsx` com o conteúdo:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMachine, useUpdateMachine } from '@/hooks/use-machines';
import { authService } from '@/services/machine-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { CATEGORIES, BUSINESS_TYPES, ALL_MANUFACTURERS, STATES_SUL, QUICK_TAGS } from '@/lib/constants';
import { CreateMachineData } from '@/types/machine';

export default function EditMachinePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: machine, isLoading } = useMachine(params.id);
  const updateMachine = useUpdateMachine();
  const [formData, setFormData] = useState<Partial<CreateMachineData>>({});

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      router.push('/login');
    }
  }, [router]);

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
        serialNumber: machine.serialNumber,
        price: machine.price,
        state: machine.state,
        city: machine.city,
        zipCode: machine.zipCode,
        images: machine.images,
        videoUrl: machine.videoUrl,
        quickTags: machine.quickTags,
        acceptsTradeDown: machine.acceptsTradeDown,
        acceptsTradeUp: machine.acceptsTradeUp,
        acceptsGrains: machine.acceptsGrains,
        acceptsFinancing: machine.acceptsFinancing,
        ownerPhone: machine.ownerPhone,
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
    
    try {
      await updateMachine.mutateAsync({ id: params.id, data: formData });
      alert('Máquina atualizada com sucesso!');
      router.push('/dashboard');
    } catch (error: any) {
      if (error.response?.status === 403) {
        alert('Você não tem permissão para editar esta máquina');
      } else {
        alert('Erro ao atualizar máquina');
      }
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
                  onChange={(e) => updateFormData({ yearModel: Number(e.target.value) })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Horas de Motor</Label>
                <Input
                  type="number"
                  value={formData.engineHours || ''}
                  onChange={(e) => updateFormData({ engineHours: Number(e.target.value) })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Potência (cv)</Label>
                <Input
                  type="number"
                  value={formData.power || ''}
                  onChange={(e) => updateFormData({ power: Number(e.target.value) })}
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label>Preço (R$)</Label>
              <Input
                type="number"
                value={formData.price || ''}
                onChange={(e) => updateFormData({ price: Number(e.target.value) })}
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
```

---

## ✅ PRONTO!

Agora você tem:
- ✅ Botões Editar e Deletar no dashboard
- ✅ Página de edição completa
- ✅ Confirmação antes de deletar
- ✅ Tratamento de erros 403/404
- ✅ Integração com backend

Teste e me avise se funcionou! 🚀
