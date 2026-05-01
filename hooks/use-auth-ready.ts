import { useEffect, useMemo, useState } from 'react';
import { bootstrapAccessToken, getAccessToken } from '@/lib/http-client';

function getAuthSnapshot() {
  if (typeof window === 'undefined') {
    return { hasUser: false, hasToken: false };
  }

  try {
    return {
      hasUser: Boolean(localStorage.getItem('currentUser')),
      hasToken: Boolean(getAccessToken()),
    };
  } catch {
    return { hasUser: false, hasToken: Boolean(getAccessToken()) };
  }
}

export function useAuthReady() {
  const [{ hasUser, hasToken }, setSnapshot] = useState(getAuthSnapshot);
  const [isBootstrapping, setIsBootstrapping] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const syncSnapshot = () => {
      if (isMounted) {
        setSnapshot(getAuthSnapshot());
      }
    };

    const ensureAccessToken = async () => {
      const current = getAuthSnapshot();
      if (!current.hasUser || current.hasToken) {
        syncSnapshot();
        return;
      }

      setIsBootstrapping(true);
      await bootstrapAccessToken();
      if (!isMounted) return;
      syncSnapshot();
      setIsBootstrapping(false);
    };

    ensureAccessToken();

    window.addEventListener('auth-token-changed', syncSnapshot);
    window.addEventListener('storage', syncSnapshot);

    return () => {
      isMounted = false;
      window.removeEventListener('auth-token-changed', syncSnapshot);
      window.removeEventListener('storage', syncSnapshot);
    };
  }, []);

  return useMemo(
    () => ({
      isAuthenticated: hasUser && hasToken,
      isBootstrapping,
      hasUser,
      hasToken,
    }),
    [hasUser, hasToken, isBootstrapping]
  );
}
