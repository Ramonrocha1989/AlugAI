'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/machine-api';
import { adminService } from '@/services/admin-api';
import { useToast } from '@/components/toast-provider';
import { getApiErrorMessage } from '@/lib/error-handler';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Shield, Star, TrendingUp, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { cpf, cnpj } from 'cpf-cnpj-validator';

export default function VerificationPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [docError, setDocError] = useState('');
  
  const [formData, setFormData] = useState(() => {
    const user = authService.getCurrentUser();
    return {
      documentType: 'CPF',
      documentNumber: '',
      companyName: '',
      phone: '',
      email: user?.email || '',
      reason: '',
    };
  });

  const formatCPF = (value: string): string => {
    const nums = value.replace(/\D/g, '').slice(0, 11);
    return nums
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const formatCNPJ = (value: string): string => {
    const nums = value.replace(/\D/g, '').slice(0, 14);
    return nums
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  };

  const handleDocChange = (value: string) => {
    const formatted = formData.documentType === 'CPF' ? formatCPF(value) : formatCNPJ(value);
    setFormData({ ...formData, documentNumber: formatted });
    setDocError('');
  };

  const validateDoc = (): boolean => {
    const nums = formData.documentNumber.replace(/\D/g, '');
    if (formData.documentType === 'CPF') {
      if (!cpf.isValid(nums)) {
        setDocError('CPF inv\u00e1lido');
        return false;
      }
    } else {
      if (!cnpj.isValid(nums)) {
        setDocError('CNPJ inv\u00e1lido');
        return false;
      }
    }
    return true;
  };

  const formatPhone = (value: string): string => {
    const nums = value.replace(/\D/g, '').slice(0, 11);
    if (nums.length <= 2) return nums;
    if (nums.length <= 7) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`;
    return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateDoc()) return;
    setLoading(true);

    try {
      await adminService.requestVerification(formData);
      setSubmitted(true);
    } catch (error: unknown) {
      showToast(getApiErrorMessage(error, 'Erro ao enviar solicitação'), 'error');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Solicitação Enviada!</h2>
              <p className="text-muted-foreground mb-6">
                Recebemos sua solicitação de verificação. Nossa equipe irá analisar 
                seus dados e entrar em contato em até 2 dias úteis.
              </p>
              <div className="space-y-2 text-sm text-left bg-muted p-4 rounded-lg mb-6">
                <p><strong>Próximos passos:</strong></p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Análise dos documentos pela equipe</li>
                  <li>Verificação das informações</li>
                  <li>Aprovação e ativação do selo</li>
                  <li>Notificação por email</li>
                </ol>
              </div>
              <Button onClick={() => router.push('/dashboard')}>
                Voltar ao Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar - Benefícios */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Selo Verificado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Benefícios
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Seus anúncios aparecem em destaque</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Maior confiança dos compradores</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Badge verde em todos os anúncios</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Prioridade no suporte</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                <div className="flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">
                      +40% mais visualizações
                    </p>
                    <p className="text-xs text-blue-700">
                      Vendedores verificados vendem mais rápido
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-sm">Critérios</h3>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li>• Documento válido (CPF ou CNPJ)</li>
                  <li>• Telefone verificado</li>
                  <li>• Histórico de anúncios</li>
                  <li>• Sem reclamações</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Formulário */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Solicitar Verificação</CardTitle>
              <p className="text-sm text-muted-foreground">
                Preencha os dados abaixo para solicitar o selo de vendedor verificado
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Tipo de Documento</Label>
                  <select
                    value={formData.documentType}
                    onChange={(e) => setFormData({ ...formData, documentType: e.target.value, documentNumber: '' })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-2"
                    required
                  >
                    <option value="CPF">CPF (Pessoa Física)</option>
                    <option value="CNPJ">CNPJ (Pessoa Jurídica)</option>
                  </select>
                </div>

                <div>
                  <Label>Número do Documento</Label>
                  <Input
                    value={formData.documentNumber}
                    onChange={(e) => handleDocChange(e.target.value)}
                    placeholder={formData.documentType === 'CPF' ? '000.000.000-00' : '00.000.000/0000-00'}
                    required
                    className={`mt-2 ${docError ? 'border-destructive' : ''}`}
                  />
                  {docError && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      <p className="text-sm text-destructive">{docError}</p>
                    </div>
                  )}
                </div>

                <div>
                  <Label>Nome Completo / Razão Social</Label>
                  <Input
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="Seu nome ou nome da empresa"
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Telefone/WhatsApp</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                    placeholder="(00) 00000-0000"
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="seu@email.com"
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Por que deseja ser verificado? (opcional)</Label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="Ex: Sou revendedor de máquinas agrícolas há 10 anos..."
                    rows={3}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-2"
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <p className="text-sm text-yellow-900">
                    <strong>Atenção:</strong> Nossa equipe entrará em contato para validar 
                    os documentos. O processo leva até 2 dias úteis.
                  </p>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Solicitar Verificação
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
