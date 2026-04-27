import { httpClient, validateEndpoint } from './http-client';

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const safeUrl = validateEndpoint(endpoint);
  const method = (options.method || 'GET').toLowerCase() as 'get' | 'post' | 'put' | 'patch' | 'delete';
  const body = options.body ? JSON.parse(options.body as string) : undefined;

  const response = await httpClient.request({
    url: safeUrl,
    method,
    data: body,
    headers: options.headers as Record<string, string>,
  });

  return response.data;
}
