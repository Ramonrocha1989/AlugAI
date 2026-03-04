'use client';

import { AlertCircle, X } from 'lucide-react';
import { Button } from './ui/button';

interface ValidationSummaryProps {
  errors: Record<string, string>;
  onFieldClick?: (field: string) => void;
  onClose?: () => void;
}

const fieldLabels: Record<string, string> = {
  email: 'Email',
  phone: 'Telefone',
  price: 'Preço',
  yearModel: 'Ano do Modelo',
  serialNumber: 'Número de Série',
  description: 'Descrição',
  model: 'Modelo',
  companyName: 'Nome da Empresa',
  companyDocument: 'CPF/CNPJ',
  password: 'Senha',
  power: 'Potência',
  engineHours: 'Horas de Motor',
};

export function ValidationSummary({ errors, onFieldClick, onClose }: ValidationSummaryProps) {
  const errorFields = Object.entries(errors).filter(([_, error]) => error);
  
  if (errorFields.length === 0) return null;

  return (
    <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-4 mb-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <h3 className="font-medium text-destructive">
            {errorFields.length === 1 ? 'Campo com erro:' : `${errorFields.length} campos com erro:`}
          </h3>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <ul className="space-y-1">
        {errorFields.map(([field, error]) => (
          <li key={field} className="text-sm">
            <button
              onClick={() => onFieldClick?.(field)}
              className="text-left hover:underline text-destructive"
            >
              <strong>{fieldLabels[field] || field}:</strong> {error}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}