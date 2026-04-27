const isDevelopment = process.env.NODE_ENV !== 'production';

function sanitize(arg: unknown): unknown {
  if (typeof arg === 'string') {
    return arg.replace(/[\r\n\t]/g, ' ').replace(/[\x00-\x1F\x7F]/g, '');
  }
  return arg;
}

function sanitizeArgs(args: unknown[]): unknown[] {
  return args.map(sanitize);
}

export const logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment) console.log(...sanitizeArgs(args));
  },
  error: (...args: unknown[]) => {
    if (isDevelopment) console.error(...sanitizeArgs(args));
  },
  warn: (...args: unknown[]) => {
    if (isDevelopment) console.warn(...sanitizeArgs(args));
  },
  info: (...args: unknown[]) => {
    if (isDevelopment) console.info(...sanitizeArgs(args));
  },
};
