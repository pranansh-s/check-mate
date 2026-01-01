'use client';

import { useEffect, useState } from 'react';

import UserService from '@/services/user.service';
import { Profile } from '@check-mate/shared/types';
import { onAuthStateChanged, onIdTokenChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { Provider } from 'react-redux';

import { auth, db } from '@/lib/firebase';
import { setAccessToken } from '@/lib/utils/auth';

import { onUpdate } from './features/userSlice';
import { store } from './store';

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);

    const tokenUnsubscribe = onIdTokenChanged(auth, async user => {
      if (user) {
        const token = await user.getIdToken();
        setAccessToken(token);
      } else {
        setAccessToken(null);
      }
    });

    const authUnsubscribe = onAuthStateChanged(auth, user => {
      if (!user) {
        sessionStorage.removeItem('profile');
        return;
      }

      UserService.refreshProfile(user.uid);
      return onSnapshot(
        doc(db, 'profiles', user.uid),
        snapshot => {
          const profileData = snapshot.data() as Profile;
          store.dispatch(onUpdate(profileData));
          sessionStorage.setItem('profile', JSON.stringify(profileData));
        },
        error => {
          console.log('profile listener error:', error);
          UserService.logOut();
        }
      );
    });

    return () => {
      authUnsubscribe();
      tokenUnsubscribe();
    };
  }, []);

  if (!mounted) return null;
  return <Provider store={store}>{children}</Provider>;
}
