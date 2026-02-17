import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitiza HTML para prevenir XSS
 * Remove scripts maliciosos mantendo formatação básica
 */
export const sanitizeHTML = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br', 'p', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: [],
  });
};

/**
 * Sanitiza texto puro (remove todas as tags HTML)
 */
export const sanitizeText = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
};
