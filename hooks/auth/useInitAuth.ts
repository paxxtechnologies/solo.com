'use client';

import { useEffect } from 'react';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';

export function useInitAuth() {
  const { setUser, clearUser, setLoading } = useAuthStore();

  useEffect(() => {
    const restore = async () => {
      setLoading(true);
      try {
        const res = await authService.getMe();
        setUser(res.data.data);
      } catch {
        clearUser();
      }
    };
    restore();
  }, []);
}