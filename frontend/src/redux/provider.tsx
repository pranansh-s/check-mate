'use client';

import { useEffect, useState } from 'react';

import { UserProfile } from '@/types';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { Provider } from 'react-redux';

import { auth, db } from '@/lib/firebase';
import { logOut, refreshProfile } from '@/lib/utils/user';

import { onUpdate } from './features/userSlice';
import { store } from './store';

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const authUnsubscribe = onAuthStateChanged(auth, async firebaseUser => {
      if (!firebaseUser) return;

      await refreshProfile(firebaseUser.uid);
      document.cookie = `uid=${firebaseUser.uid}; path=/; samesite=strict;`;

      return onSnapshot(
        doc(db, 'profiles', firebaseUser.uid),
        snapshot => {
          const profileData = snapshot.data() as UserProfile;
          store.dispatch(onUpdate(profileData));
          sessionStorage.setItem('profile', JSON.stringify(profileData));
        },
        error => {
          console.log('profile listener error:', error);
          logOut();
        }
      );
    });

    return () => {
      authUnsubscribe();
      document.cookie = 'uid=; path=/; samesite=strict;';
    };
  }, []);

  if (!mounted) return null;
  return <Provider store={store}>{children}</Provider>;
}
