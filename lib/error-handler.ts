const AXIOS_GENERIC_MESSAGE = /^Request failed with status code \d+$/;

type AxiosErrorLike = {
  response?: {
    status?: number;
    data?: { message?: string | string[] };
  };
};

function getAxiosResponse(error: unknown): AxiosErrorLike['response'] | undefined {
  if (error && typeof error === 'object' && 'response' in error) {
    return (error as AxiosErrorLike).response;
  }
  return undefined;
}

/** Status HTTP de erros Axios (ex.: 403, 400). */
export function getApiErrorStatus(error: unknown): number | undefined {
  return getAxiosResponse(error)?.status;
}

/** Extrai mensagem legível de erros Axios/NestJS (ex.: "Email ou senha inválidos"). */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  const response = getAxiosResponse(error);
  if (response?.status && response.status >= 500) return fallback;

  const msg = response?.data?.message;
  if (typeof msg === 'string' && msg.trim()) return msg;
  if (Array.isArray(msg) && msg.length > 0) return msg.join(', ');

  if (
    error instanceof Error &&
    error.message &&
    !AXIOS_GENERIC_MESSAGE.test(error.message)
  ) {
    return error.message;
  }
  return fallback;
}

// Mapear erros do backend para mensagens em português
const errorMessages: Record<string, string> = {
  'Number must be greater than 0': 'Deve ser maior que 0',
  'Number must be less than or equal to 999999': 'Deve ser menor que 1.000.000',
  'Number must be less than or equal to 999': 'Deve ser menor que 1000',
  'String must contain at least 100 character(s)': 'Deve ter no mínimo 100 caracteres',
  'String must contain at least 6 character(s)': 'Deve ter no mínimo 6 caracteres',
  'String must contain at most 25 character(s)': 'Deve ter no máximo 25 caracteres',
  'Invalid email': 'Email inválido',
  'Required': 'Campo obrigatório',
};

const fieldNames: Record<string, string> = {
  power: 'Potência',
  engineHours: 'Horas de Motor',
  price: 'Preço',
  description: 'Descrição',
  serialNumber: 'Número de Série',
  model: 'Modelo',
  manufacturer: 'Fabricante',
  yearModel: 'Ano do Modelo',
  state: 'Estado',
  city: 'Cidade',
  name: 'Nome',
  images: 'Imagens',
};

export interface BackendValidationError {
  code: string;
  message: string;
  path: string[];
}

export function parseBackendErrors(errors: BackendValidationError[]): Record<string, string> {
  const parsedErrors: Record<string, string> = {};
  
  errors.forEach(error => {
    const field = error.path[0];
    const fieldName = fieldNames[field] || field;
    const message = errorMessages[error.message] || error.message;
    
    parsedErrors[field] = `${fieldName}: ${message}`;
  });
  
  return parsedErrors;
}

export function showBackendErrors(errors: BackendValidationError[], showToast: (message: string, type: 'error') => void) {
  const parsedErrors = parseBackendErrors(errors);
  const errorList = Object.values(parsedErrors);
  
  if (errorList.length === 1) {
    showToast(`❌ ${errorList[0]}`, 'error');
  } else {
    showToast(`❌ ${errorList.length} campos com erro. Verifique os campos destacados.`, 'error');
  }
  
  return parsedErrors;
}