'use client';

import * as React from "react";
import { cn } from "@/lib/utils";

export interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: number | null;
  onChange?: (value: number) => void;
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState('');

    // Formatar valor para exibição
    const formatCurrency = (num: number): string => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(num);
    };

    // Converter string formatada para número
    const parseCurrency = (str: string): number => {
      const cleanStr = str.replace(/[^\d]/g, '');
      return parseInt(cleanStr) || 0;
    };

    // Atualizar display quando value prop muda
    React.useEffect(() => {
      const safeValue = value ?? 0;
      setDisplayValue(safeValue > 0 ? formatCurrency(safeValue) : '');
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const numericValue = parseCurrency(inputValue);
      
      if (numericValue === 0) {
        setDisplayValue('');
        onChange?.(0);
      } else {
        const formatted = formatCurrency(numericValue);
        setDisplayValue(formatted);
        onChange?.(numericValue);
      }
    };

    return (
      <input
        {...props}
        ref={ref}
        type="text"
        value={displayValue}
        onChange={handleChange}
        placeholder="R$ 0"
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      />
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };