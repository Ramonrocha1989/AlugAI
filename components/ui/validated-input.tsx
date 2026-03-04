'use client';

import * as React from 'react';
import { Input, InputProps } from './input';
import { Label } from './label';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ValidatedInputProps extends InputProps {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

const ValidatedInput = React.forwardRef<HTMLInputElement, ValidatedInputProps>(
  ({ label, error, helperText, required, className, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
    
    return (
      <div className="space-y-2">
        <Label htmlFor={inputId} className={required ? "after:content-['*'] after:text-destructive after:ml-1" : ""}>
          {label}
        </Label>
        <Input
          id={inputId}
          ref={ref}
          className={cn(error ? 'border-destructive focus-visible:ring-destructive' : '', className)}
          {...props}
        />
        {error && (
          <div className="flex items-center gap-1">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
        {helperText && !error && (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);

ValidatedInput.displayName = 'ValidatedInput';

export { ValidatedInput };