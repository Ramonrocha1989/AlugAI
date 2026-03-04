'use client';

import { useState, useCallback } from 'react';
import { z } from 'zod';

// Validações individuais para uso em tempo real
export const validateEmail = (email: string) => {
  try {
    z.string().email().parse(email);
    return null;
  } catch {
    return 'Email inválido';
  }
};

export const validatePhone = (phone: string) => {
  try {
    z.string().regex(/^\d{10,11}$/).parse(phone);
    return null;
  } catch {
    return 'Telefone inválido. Use formato: DDD + número (ex: 51999887766)';
  }
};

export const validatePrice = (price: string) => {
  const num = Number(price);
  if (isNaN(num) || num <= 0) {
    return 'Preço deve ser maior que zero';
  }
  return null;
};

export const validateYear = (year: string) => {
  const num = Number(year);
  const currentYear = new Date().getFullYear();
  if (isNaN(num) || num < 1980 || num > currentYear + 1) {
    return 'Ano inválido';
  }
  return null;
};

export const validateSerialNumber = (serial: string) => {
  if (!serial || serial.length < 6) {
    return 'Número de série deve ter no mínimo 6 caracteres';
  }
  if (serial.length > 25) {
    return 'Número de série deve ter no máximo 25 caracteres';
  }
  if (!/^[A-Z0-9-]+$/i.test(serial)) {
    return 'Apenas letras, números e hífens são permitidos';
  }
  return null;
};

export const validateDescription = (description: string) => {
  if (!description || description.length < 100) {
    return 'Descrição deve ter no mínimo 100 caracteres';
  }
  return null;
};

export const validatePower = (power: string) => {
  const num = parseFloat(power.replace(',', '.'));
  if (power && (isNaN(num) || num <= 0)) {
    return 'Potência deve ser maior que 0';
  }
  if (num > 9999) {
    return 'Potência deve ser menor que 10.000 cv';
  }
  return null;
};

export const validateEngineHours = (hours: string) => {
  const num = Number(hours);
  if (hours && (isNaN(num) || num < 0)) {
    return 'Horas devem ser maior ou igual a 0';
  }
  if (num > 999999) {
    return 'Horas devem ser menor que 1.000.000';
  }
  return null;
};

// Hook para validação em tempo real
export const useRealTimeValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = useCallback((field: string, value: string) => {
    let error = null;

    switch (field) {
      case 'email':
        error = validateEmail(value);
        break;
      case 'phone':
        error = validatePhone(value);
        break;
      case 'price':
        error = validatePrice(value);
        break;
      case 'yearModel':
        error = validateYear(value);
        break;
      case 'serialNumber':
        error = validateSerialNumber(value);
        break;
      case 'description':
        error = validateDescription(value);
        break;
      case 'power':
        error = validatePower(value);
        break;
      case 'engineHours':
        error = validateEngineHours(value);
        break;
    }

    setErrors(prev => ({
      ...prev,
      [field]: error || ''
    }));

    return !error;
  }, []);

  const clearError = useCallback((field: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: ''
    }));
  }, []);

  return { errors, validateField, clearError, setErrors };
};