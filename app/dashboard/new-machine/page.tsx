'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateMachine } from '@/hooks/use-machines';
import { authService, machineService } from '@/services/machine-api';
import { useToast } from '@/components/toast-provider';
import { useRealTimeValidation } from '@/hooks/use-validation';
import { ValidationSummary } from '@/components/validation-summary';
import { showBackendErrors } from '@/lib/error-handler';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ValidatedInput } from '@/components/ui/validated-input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ImageUpload } from '@/components/image-upload';
import { analytics } from '@/lib/analytics';
import { Loader2, ArrowLeft, ArrowRight, Check, AlertCircle, MessageCircle } from 'lucide-react';
import { UpgradeLimitModal } from '@/components/upgrade-limit-modal';
import { getPlanConfig } from '@/services/machine-api';
import { PlanId } from '@/types';
import { CATEGORIES, BUSINESS_TYPES, ALL_MANUFACTURERS, STATES_SUL, QUICK_TAGS, CATEGORY_ICONS } from '@/lib/constants';
import { CreateMachineData } from '@/types/machine';

export default function NewMachinePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const createMachine = useCreateMachine();
  const { errors: validationErrors, validateField, setErrors } = useRealTimeValidation();
  const [step, setStep] = useState(1);
  const [imageUrl, setImageUrl] = useState('');
  const [receiveWhatsApp, setReceiveWhatsApp] = useState(true);
  const [checkingLimit, setCheckingLimit] = useState(true);
  const [limitError, setLimitError] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  const [formData, setFormData] = useState<Partial<CreateMachineData>>({
    images: [],
    quickTags: [],
    acceptsTradeDown: false,
    acceptsTradeUp: false,
    acceptsGrains: false,
    acceptsFinancing: false,
  });

  // Limites do plano do usuário
  const currentUser = authService.getCurrentUser();
  const planConfig = getPlanConfig((currentUser?.plan || 'free') as PlanId);
  const maxPhotos = planConfig.maxPhotos;
  const maxVideos = planConfig.maxVideos;

  useEffect(() => {
    const checkUserAndLimit = async () => {
      const user = authService.getCurrentUser();
      if (!user) {
        // router.push("/login");
        return;
      }

      try {
        const myMachines = await machineService.getMyMachines();
        const userPlan = (user.plan || 'free') as PlanId;
        const planConfig = getPlanConfig(userPlan);
        
        if (myMachines.length >= planConfig.maxAds) {
          setLimitError(`Limite de ${planConfig.maxAds} anúncios atingido no plano ${planConfig.name}. Faça upgrade para anunciar mais.`);
          setShowUpgradeModal(true);
        }
      } catch (error: any) {
        if (error.response?.status === 403) {
          setLimitError(error.response?.data?.message || 'Limite de anúncios atingido');
          setShowUpgradeModal(true);
        }
      } finally {
        setCheckingLimit(false);
      }
    };

    checkUserAndLimit();
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
    if (imageUrl && formData.images && formData.images.length < maxPhotos) {
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
      
      analytics.trackMachineCreate(
        formData.category || 'unknown',
        formData.businessType || 'unknown'
      );
      
      if (receiveWhatsApp && formData.ownerPhone) {
        showToast(`✅ Anúncio publicado! Você receberá propostas no WhatsApp: ${formData.ownerPhone}`, 'success');
      } else {
        showToast('✅ Anúncio publicado com sucesso!', 'success');
      }
      
      router.push('/dashboard');
    } catch (error: any) {
      if (error.response?.status === 403) {
        const message = error.response?.data?.message || 'Limite de anúncios atingido. Faça upgrade para o plano Lojista.';
        setLimitError(message);
        setShowUpgradeModal(true);
      } else if (error.response?.status === 400 && error.response?.data?.errors) {
        // Tratar erros de validação do backend
        const backendErrors = showBackendErrors(error.response.data.errors, showToast);
        setErrors(backendErrors);
      } else {
        showToast('Erro ao cadastrar máquina', 'error');
      }
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return formData.businessType && formData.category;
      case 2: return formData.manufacturer && formData.model && formData.yearModel && formData.serialNumber; // Chassi obrigatório
      case 3: return formData.images && formData.images.length > 0;
      case 4: return formData.price && formData.state && formData.city;
      case 5: return formData.name && formData.description && formData.description.length >= 100;
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

  if (checkingLimit) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Verificando limite de anúncios...</p>
      </div>
    );
  }

  if (limitError) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{limitError}</p>
        </div>
        <UpgradeLimitModal open={showUpgradeModal} onOpenChange={setShowUpgradeModal} currentPlan={(authService.getCurrentUser()?.plan || 'free') as PlanId} />
      </div>
    );
  }

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

      <ValidationSummary 
        errors={validationErrors}
        onFieldClick={(field) => {
          // Scroll para o campo com erro
          const element = document.getElementById(field);
          element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element?.focus();
        }}
      />

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
                      <img 
                        src={CATEGORY_ICONS[key as keyof typeof CATEGORY_ICONS]} 
                        alt={label}
                        className="w-12 h-12 mx-auto mb-2 object-contain"
                      />
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
                    id="model"
                    value={formData.model || ''}
                    onChange={(e) => {
                      updateFormData({ model: e.target.value });
                      if (e.target.value.length >= 2) {
                        validateField('model', e.target.value);
                      }
                    }}
                    placeholder="Ex: 6125J"
                    className={`mt-2 ${validationErrors.model ? 'border-destructive' : ''}`}
                  />
                  {validationErrors.model && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      <p className="text-sm text-destructive">{validationErrors.model}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Ano do Modelo</Label>
                  <Input
                    id="yearModel"
                    type="number"
                    value={formData.yearModel || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      const year = Number(value);
                      updateFormData({ yearModel: year });
                      if (value) {
                        validateField('yearModel', value);
                      }
                    }}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
                        e.preventDefault();
                      }
                    }}
                    placeholder="2020"
                    className={`mt-2 ${validationErrors.yearModel ? 'border-destructive' : ''}`}
                  />
                  {validationErrors.yearModel && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      <p className="text-sm text-destructive">{validationErrors.yearModel}</p>
                    </div>
                  )}
                </div>

                <div>
                  <Label>⭐ Horas de Motor</Label>
                  <Input
                    id="engineHours"
                    type="number"
                    value={formData.engineHours || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      const hours = Number(value);
                      updateFormData({ engineHours: hours });
                      if (value) {
                        validateField('engineHours', value);
                      }
                    }}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
                        e.preventDefault();
                      }
                    }}
                    placeholder="3200"
                    className={`mt-2 ${validationErrors.engineHours ? 'border-destructive' : ''}`}
                  />
                  {validationErrors.engineHours && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      <p className="text-sm text-destructive">{validationErrors.engineHours}</p>
                    </div>
                  )}
                </div>

                <div>
                  <Label>Potência (cv)</Label>
                  <Input
                    id="power"
                    type="number"
                    step="0.1"
                    value={formData.power || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.,]/g, '').replace(',', '.');
                      const power = parseFloat(value);
                      updateFormData({ power: isNaN(power) ? undefined : power });
                      if (value) {
                        validateField('power', value);
                      }
                    }}
                    onKeyPress={(e) => {
                      if (!/[0-9.,]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
                        e.preventDefault();
                      }
                    }}
                    placeholder="125"
                    className={`mt-2 ${validationErrors.power ? 'border-destructive' : ''}`}
                  />
                  {validationErrors.power && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      <p className="text-sm text-destructive">{validationErrors.power}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Chassi OBRIGATÓRIO */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <div className="flex items-start gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <Label className="text-blue-900">Número de Série/Chassi (Obrigatório)</Label>
                    <p className="text-xs text-blue-700 mt-1">
                      Para sua segurança e dos compradores, o número de série é obrigatório. 
                      Isso reduz fraudes e aumenta a confiança no anúncio.
                    </p>
                  </div>
                </div>
                <Input
                  id="serialNumber"
                  value={formData.serialNumber || ''}
                  onChange={(e) => {
                    updateFormData({ serialNumber: e.target.value });
                    validateField('serialNumber', e.target.value);
                  }}
                  placeholder="Ex: JD6125J2018BR001234"
                  className={`mt-2 ${validationErrors.serialNumber ? 'border-destructive' : ''}`}
                  required
                />
                {validationErrors.serialNumber && (
                  <div className="flex items-center gap-1 mt-1">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <p className="text-sm text-destructive">{validationErrors.serialNumber}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TELA 3: Vitrine Visual */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label>Fotos da Máquina (1 a {maxPhotos})</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  📸 Sugestão: lateral completa, painel de horas, pneus/esteiras, motor, <strong>número de série</strong>
                  {maxPhotos <= 3 && (
                    <span className="block text-xs text-yellow-600 mt-1">
                      ⚡ Faça upgrade para enviar mais fotos (até 25 no plano Premium)
                    </span>
                  )}
                </p>
                <ImageUpload
                  images={formData.images || []}
                  onChange={(images) => updateFormData({ images })}
                  maxImages={maxPhotos}
                />
              </div>

              <div>
                <Label>Vídeo (opcional)</Label>
                {maxVideos > 0 ? (
                  <Input
                    value={formData.videoUrl || ''}
                    onChange={(e) => updateFormData({ videoUrl: e.target.value })}
                    placeholder="URL do vídeo (até 60 segundos)"
                    className="mt-2"
                  />
                ) : (
                  <div className="mt-2 p-3 bg-muted rounded-lg text-sm text-muted-foreground">
                    🎥 Vídeo disponível a partir do plano Profissional (R$ 179/mês)
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TELA 4: Valor e Negociação */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <Label>Preço (R$)</Label>
                <CurrencyInput
                  id="price"
                  value={formData.price || 0}
                  onChange={(value) => {
                    updateFormData({ price: value });
                    if (value > 0) {
                      validateField('price', value.toString());
                    }
                  }}
                  className={`mt-2 ${validationErrors.price ? 'border-destructive' : ''}`}
                />
                {validationErrors.price && (
                  <div className="flex items-center gap-1 mt-1">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <p className="text-sm text-destructive">{validationErrors.price}</p>
                  </div>
                )}
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
                <Label>Descrição Completa (mínimo 100 caracteres)</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => {
                    updateFormData({ description: e.target.value });
                    validateField('description', e.target.value);
                  }}
                  placeholder="Descreva detalhes sobre revisões, se é único dono, cultura trabalhada..."
                  rows={6}
                  className={`mt-2 ${validationErrors.description ? 'border-destructive' : ''}`}
                />
                <div className="flex justify-between items-center mt-1">
                  <div>
                    {validationErrors.description && (
                      <div className="flex items-center gap-1">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        <p className="text-sm text-destructive">{validationErrors.description}</p>
                      </div>
                    )}
                  </div>
                  <p className={`text-xs ${
                    (formData.description?.length || 0) < 100 ? 'text-destructive' : 'text-muted-foreground'
                  }`}>
                    {formData.description?.length || 0} / 100 caracteres
                  </p>
                </div>
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

              {/* WhatsApp */}
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <div className="flex items-start gap-2 mb-3">
                  <MessageCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <Label className="text-green-900">WhatsApp para Contato</Label>
                    <p className="text-xs text-green-700 mt-1">
                      Receba propostas direto no seu WhatsApp!
                    </p>
                  </div>
                </div>
                <Input
                  id="phone"
                  value={formData.ownerPhone || ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    updateFormData({ ownerPhone: value });
                    if (value) {
                      validateField('phone', value);
                    }
                  }}
                  placeholder="51999887766"
                  maxLength={11}
                  className={`mt-2 ${validationErrors.phone ? 'border-destructive' : ''}`}
                />
                {validationErrors.phone && (
                  <div className="flex items-center gap-1 mt-1">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <p className="text-sm text-destructive">{validationErrors.phone}</p>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Formato: DDD + número (ex: 51999887766)
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
                  <p><strong>Chassi:</strong> {formData.serialNumber}</p>
                  <p><strong>Preço:</strong> R$ {formData.price?.toLocaleString('pt-BR')}</p>
                  <p><strong>Localização:</strong> {formData.city}, {formData.state}</p>
                  <p><strong>Fotos:</strong> {formData.images?.length || 0}</p>
                  {formData.ownerPhone && <p><strong>WhatsApp:</strong> {formData.ownerPhone}</p>}
                </div>
              </div>

              {/* Confirmação WhatsApp */}
              {formData.ownerPhone && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={receiveWhatsApp}
                      onChange={(e) => setReceiveWhatsApp(e.target.checked)}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-semibold text-green-900">
                        📱 Deseja receber propostas direto no WhatsApp {formData.ownerPhone}?
                      </p>
                      <p className="text-xs text-green-700 mt-1">
                        Compradores interessados poderão entrar em contato diretamente pelo WhatsApp
                      </p>
                    </div>
                  </label>
                </div>
              )}

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
