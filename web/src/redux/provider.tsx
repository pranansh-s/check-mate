'use client';

import { useEffect, useState } from 'react';

import UserService from '@/services/user.service';
import { onAuthStateChanged, onIdTokenChanged } from 'firebase/auth';
import { Provider } from 'react-redux';

import { setAccessToken } from '@/lib/utils/auth';

import { auth } from '@/lib/firebase';

import { store } from './store';

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);

    const tokenUnsubscribe = onIdTokenChanged(auth, async user => {
      if (user) {
        const token = await user.getIdToken();
        await setAccessToken(token);
      } else {
        await setAccessToken(null);
      }
    });

    const authUnsubscribe = onAuthStateChanged(auth, user => {
      if (!user || !auth.currentUser) {
        sessionStorage.removeItem('profile');
        return;
      }

      UserService.refreshProfile();
    });

    return () => {
      authUnsubscribe();
      tokenUnsubscribe();
    };
  }, []);

  if (!mounted) return null;
  return <Provider store={store}>{children}</Provider>;
}
