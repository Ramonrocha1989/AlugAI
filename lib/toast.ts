/**
 * Helper para usar toast em componentes client
 * 
 * Uso:
 * import { toast } from '@/lib/toast';
 * 
 * toast.success('Operação realizada!');
 * toast.error('Erro ao processar');
 * toast.warning('Atenção!');
 * toast.info('Informação');
 */

// Este arquivo será usado como referência
// O toast real deve ser chamado via useToast() hook

import { logger } from './logger';

export const toast = {
  success: (message: string) => { logger.log('[Toast Success]:', message); },
  error: (message: string) => { logger.log('[Toast Error]:', message); },
  warning: (message: string) => { logger.log('[Toast Warning]:', message); },
  info: (message: string) => { logger.log('[Toast Info]:', message); },
};

/**
 * INSTRUÇÕES PARA SUBSTITUIR alert():
 * 
 * 1. Adicionar no componente:
 *    import { useToast } from '@/components/toast-provider';
 *    const { showToast } = useToast();
 * 
 * 2. Substituir:
 *    alert('Sucesso!') → showToast('Sucesso!', 'success')
 *    alert('Erro!') → showToast('Erro!', 'error')
 *    alert('Atenção!') → showToast('Atenção!', 'warning')
 *    alert('Info') → showToast('Info', 'info')
 */
