import { describe, expect, it } from 'vitest';
import { getApiErrorMessage, getApiErrorStatus } from './error-handler';

function axiosLikeError(
  status: number,
  data?: { message?: string | string[] },
  errorMessage?: string
) {
  const err = new Error(errorMessage ?? `Request failed with status code ${status}`);
  return Object.assign(err, {
    response: { status, data: data ?? {} },
  });
}

describe('getApiErrorStatus', () => {
  it('retorna status de erros Axios-like', () => {
    expect(getApiErrorStatus(axiosLikeError(401, { message: 'Não autorizado' }))).toBe(401);
    expect(getApiErrorStatus(axiosLikeError(403))).toBe(403);
  });

  it('retorna undefined para erros sem response', () => {
    expect(getApiErrorStatus(new Error('falha'))).toBeUndefined();
    expect(getApiErrorStatus(null)).toBeUndefined();
    expect(getApiErrorStatus('erro')).toBeUndefined();
  });
});

describe('getApiErrorMessage', () => {
  it('extrai message string do NestJS/Axios (401)', () => {
    const error = axiosLikeError(401, { message: 'Email ou senha inválidos' });
    expect(getApiErrorMessage(error, 'Erro ao fazer login')).toBe('Email ou senha inválidos');
  });

  it('extrai message string em 403', () => {
    const error = axiosLikeError(403, { message: 'Limite de anúncios atingido' });
    expect(getApiErrorMessage(error, 'Sem permissão')).toBe('Limite de anúncios atingido');
  });

  it('junta message quando é array (validação NestJS)', () => {
    const error = axiosLikeError(400, {
      message: ['Email inválido', 'Senha obrigatória'],
    });
    expect(getApiErrorMessage(error, 'Erro de validação')).toBe(
      'Email inválido, Senha obrigatória'
    );
  });

  it('usa fallback em erros 5xx mesmo com message no body', () => {
    const error = axiosLikeError(500, { message: 'Internal server error detail' });
    expect(getApiErrorMessage(error, 'Algo deu errado')).toBe('Algo deu errado');
  });

  it('usa fallback em 502', () => {
    const error = axiosLikeError(502, { message: 'Bad Gateway' });
    expect(getApiErrorMessage(error, 'Serviço indisponível')).toBe('Serviço indisponível');
  });

  it('ignora mensagem genérica do Axios e usa fallback', () => {
    const error = new Error('Request failed with status code 401');
    expect(getApiErrorMessage(error, 'Erro ao fazer login')).toBe('Erro ao fazer login');
  });

  it('usa fallback quando response não tem message', () => {
    const error = axiosLikeError(401, {});
    expect(getApiErrorMessage(error, 'Erro ao fazer login')).toBe('Erro ao fazer login');
  });

  it('usa fallback para message vazia ou só espaços', () => {
    expect(getApiErrorMessage(axiosLikeError(400, { message: '' }), 'Fallback')).toBe('Fallback');
    expect(getApiErrorMessage(axiosLikeError(400, { message: '   ' }), 'Fallback')).toBe('Fallback');
  });

  it('usa fallback para array vazio', () => {
    const error = axiosLikeError(400, { message: [] });
    expect(getApiErrorMessage(error, 'Fallback')).toBe('Fallback');
  });

  it('retorna Error.message útil quando não é padrão Axios', () => {
    expect(getApiErrorMessage(new Error('Falha de rede'), 'Fallback')).toBe('Falha de rede');
  });

  it('retorna fallback para valores desconhecidos', () => {
    expect(getApiErrorMessage(undefined, 'Fallback')).toBe('Fallback');
    expect(getApiErrorMessage({ foo: 'bar' }, 'Fallback')).toBe('Fallback');
  });
});
