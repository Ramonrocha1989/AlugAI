'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateMachine } from '@/hooks/use-machines';
import { authService } from '@/services/machine-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { CATEGORIES, BUSINESS_TYPES, ALL_MANUFACTURERS, STATES_SUL, QUICK_TAGS } from '@/lib/constants';
import { CreateMachineData } from '@/types/machine';

export default function NewMachinePage() {
  const router = useRouter();
  const createMachine = useCreateMachine();
  const [step, setStep] = useState(1);
  const [imageUrl, setImageUrl] = useState('');
  
  const [formData, setFormData] = useState<Partial<CreateMachineData>>({
    images: [],
    quickTags: [],
    acceptsTradeDown: false,
    acceptsTradeUp: false,
    acceptsGrains: false,
    acceptsFinancing: false,
  });

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      router.push('/login');
    }
  }, [router]);

  const updateFormData = (data: Partial<CreateMachineData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (step < 6) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleAddImage = () => {
    if (imageUrl && formData.images && formData.images.length < 10) {
      updateFormData({ images: [...formData.images, imageUrl] });
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    if (formData.images) {
      updateFormData({ images: formData.images.filter((_, i) => i !== index) });
    }
  };

  const toggleQuickTag = (tag: string) => {
    const currentTags = formData.quickTags || [];
    if (currentTags.includes(tag as any)) {
      updateFormData({ quickTags: currentTags.filter(t => t !== tag) as any });
    } else {
      updateFormData({ quickTags: [...currentTags, tag] as any });
    }
  };

  const handleSubmit = async () => {
    try {
      await createMachine.mutateAsync(formData as CreateMachineData);
      router.push('/dashboard');
    } catch (error) {
      alert('Erro ao cadastrar máquina');
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return formData.businessType && formData.category;
      case 2: return formData.manufacturer && formData.model && formData.yearModel;
      case 3: return formData.images && formData.images.length > 0;
      case 4: return formData.price && formData.state && formData.city;
      case 5: return formData.name && formData.description && formData.description.length >= 50;
      case 6: return true;
      default: return false;
    }
  };

  // Auto-gerar título
  useEffect(() => {
    if (formData.manufacturer && formData.model && formData.yearModel) {
      const title = `${formData.manufacturer} ${formData.model} ${formData.yearModel}`;
      updateFormData({ name: title });
    }
  }, [formData.manufacturer, formData.model, formData.yearModel]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Passo {step} de 6</span>
          <span className="text-sm text-muted-foreground">{Math.round((step / 6) * 100)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && 'O que vamos anunciar hoje?'}
            {step === 2 && 'DNA da Máquina'}
            {step === 3 && 'Vitrine Visual'}
            {step === 4 && 'Valor e Negociação'}
            {step === 5 && 'Descrição e Adicionais'}
            {step === 6 && 'Revisão e Publicação'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* TELA 1: Categoria */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <Label className="mb-3 block">Tipo de Negócio</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(BUSINESS_TYPES).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => updateFormData({ businessType: key as any })}
                      className={`p-4 border-2 rounded-lg text-center transition-all ${
                        formData.businessType === key
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="font-semibold">{label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Categoria da Máquina</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(CATEGORIES).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => updateFormData({ category: key as any })}
                      className={`p-6 border-2 rounded-lg text-center transition-all ${
                        formData.category === key
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="text-3xl mb-2">🚜</div>
                      <div className="font-semibold text-sm">{label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TELA 2: DNA da Máquina */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Fabricante</Label>
                  <select
                    value={formData.manufacturer || ''}
                    onChange={(e) => updateFormData({ manufacturer: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-2"
                  >
                    <option value="">Selecione...</option>
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
                    placeholder="Ex: 6125J"
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Ano do Modelo</Label>
                  <Input
                    type="number"
                    value={formData.yearModel || ''}
                    onChange={(e) => updateFormData({ yearModel: Number(e.target.value) })}
                    placeholder="2020"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>⭐ Horas de Motor</Label>
                  <Input
                    type="number"
                    value={formData.engineHours || ''}
                    onChange={(e) => updateFormData({ engineHours: Number(e.target.value) })}
                    placeholder="3200"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Potência (cv)</Label>
                  <Input
                    type="number"
                    value={formData.power || ''}
                    onChange={(e) => updateFormData({ power: Number(e.target.value) })}
                    placeholder="125"
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label>Número de Série/Chassi (opcional)</Label>
                <Input
                  value={formData.serialNumber || ''}
                  onChange={(e) => updateFormData({ serialNumber: e.target.value })}
                  placeholder="Para verificação"
                  className="mt-2"
                />
              </div>
            </div>
          )}

          {/* TELA 3: Vitrine Visual */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label>Fotos da Máquina (1 a 10)</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Sugestão: lateral completa, painel de horas, pneus/esteiras, motor
                </p>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Cole a URL da imagem"
                  />
                  <Button type="button" onClick={handleAddImage}>
                    Adicionar
                  </Button>
                </div>
                {formData.images && formData.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {formData.images.map((url, index) => (
                      <div key={index} className="relative border rounded p-2">
                        <img src={url} alt={`Foto ${index + 1}`} className="w-full h-32 object-cover rounded" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-3 right-3"
                        >
                          Remover
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label>Vídeo (opcional)</Label>
                <Input
                  value={formData.videoUrl || ''}
                  onChange={(e) => updateFormData({ videoUrl: e.target.value })}
                  placeholder="URL do vídeo (até 30 segundos)"
                  className="mt-2"
                />
              </div>
            </div>
          )}

          {/* TELA 4: Valor e Negociação */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <Label>Preço (R$)</Label>
                <Input
                  type="number"
                  value={formData.price || ''}
                  onChange={(e) => updateFormData({ price: Number(e.target.value) })}
                  placeholder="285000"
                  className="mt-2"
                />
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
                    <span className="text-sm">Aceito troca por máquina de maior valor (dou volta)</span>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Estado</Label>
                  <select
                    value={formData.state || ''}
                    onChange={(e) => updateFormData({ state: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-2"
                  >
                    <option value="">Selecione...</option>
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
                    placeholder="Passo Fundo"
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label>CEP (opcional)</Label>
                <Input
                  value={formData.zipCode || ''}
                  onChange={(e) => updateFormData({ zipCode: e.target.value })}
                  placeholder="99010-000"
                  className="mt-2"
                />
              </div>
            </div>
          )}

          {/* TELA 5: Descrição e Adicionais */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <Label>Título do Anúncio</Label>
                <Input
                  value={formData.name || ''}
                  onChange={(e) => updateFormData({ name: e.target.value })}
                  placeholder="Gerado automaticamente"
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Sugestão: {formData.manufacturer} {formData.model} {formData.yearModel}
                </p>
              </div>

              <div>
                <Label>Descrição Completa (mínimo 50 caracteres)</Label>
                <Textarea
                  value={formData.description || ''}
                  onChange={(e) => updateFormData({ description: e.target.value })}
                  placeholder="Descreva detalhes sobre revisões, se é único dono, cultura trabalhada..."
                  rows={6}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.description?.length || 0} caracteres
                </p>
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
                <Label>WhatsApp (opcional)</Label>
                <Input
                  value={formData.ownerPhone || ''}
                  onChange={(e) => updateFormData({ ownerPhone: e.target.value })}
                  placeholder="5554999887766"
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Formato: 55 + DDD + número (ex: 5554999887766)
                </p>
              </div>
            </div>
          )}

          {/* TELA 6: Revisão */}
          {step === 6 && (
            <div className="space-y-6">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-4">Preview do Anúncio</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Título:</strong> {formData.name}</p>
                  <p><strong>Categoria:</strong> {formData.category && CATEGORIES[formData.category]}</p>
                  <p><strong>Tipo:</strong> {formData.businessType && BUSINESS_TYPES[formData.businessType]}</p>
                  <p><strong>Fabricante:</strong> {formData.manufacturer} {formData.model}</p>
                  <p><strong>Ano:</strong> {formData.yearModel}</p>
                  {formData.engineHours && <p><strong>Horas:</strong> {formData.engineHours}h</p>}
                  {formData.power && <p><strong>Potência:</strong> {formData.power} cv</p>}
                  <p><strong>Preço:</strong> R$ {formData.price?.toLocaleString('pt-BR')}</p>
                  <p><strong>Localização:</strong> {formData.city}, {formData.state}</p>
                  <p><strong>Fotos:</strong> {formData.images?.length || 0}</p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <p className="text-sm">
                  <strong>Aviso:</strong> Ao publicar, você garante que as informações são verídicas 
                  e que possui a posse legal da máquina.
                </p>
              </div>
            </div>
          )}

          {/* Navegação */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>

            {step < 6 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
              >
                Próximo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={createMachine.isPending || !canProceed()}
              >
                {createMachine.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publicando...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Publicar Anúncio
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
