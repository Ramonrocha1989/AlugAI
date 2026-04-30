import { NextRequest } from 'next/server';

const BACKEND = process.env.BACKEND_URL || 'http://localhost:3000';

function getSetCookieHeaders(res: Response): string[] {
  const setCookies = res.headers.getSetCookie?.() ?? [];
  if (setCookies.length > 0) return setCookies;

  const singleHeader = res.headers.get('set-cookie');
  return singleHeader ? [singleHeader] : [];
}

async function handler(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const backendUrl = `${BACKEND}${pathname}${search}`;

  const headers = new Headers();
  // Repassar headers relevantes
  const forward = ['content-type', 'authorization', 'cookie', 'accept', 'accept-language'];
  for (const key of forward) {
    const val = req.headers.get(key);
    if (val) headers.set(key, val);
  }

  const res = await fetch(backendUrl, {
    method: req.method,
    headers,
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : req.body,
    // @ts-expect-error duplex
    duplex: 'half',
  });

  // Construir headers de resposta manualmente
  const resHeaders: Record<string, string> = {};
  res.headers.forEach((val, key) => {
    if (key.toLowerCase() !== 'set-cookie') {
      resHeaders[key] = val;
    }
  });

  // Repassar Set-Cookie exatamente como veio do backend
  const setCookies = getSetCookieHeaders(res);
  const body = await res.arrayBuffer();

  const response = new Response(body, {
    status: res.status,
    headers: resHeaders,
  });

  for (const cookie of setCookies) {
    response.headers.append('set-cookie', cookie);
  }

  return response;
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
