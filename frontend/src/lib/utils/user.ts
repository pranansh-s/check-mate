import { UserProfile } from '@/types';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { onLogin, onLogout } from '@/redux/features/userSlice';
import { store } from '@/redux/store';
import { strings } from '@/constants/strings';

import { auth, db } from '../firebase';
import { handleErrors } from './error';

export const refreshProfile = async (uid: string) => {
  const cachedProfile = sessionStorage.getItem('profile');

  if (cachedProfile && cachedProfile !== 'undefined') {
    try {
      const parsedProfile = JSON.parse(cachedProfile) as UserProfile;
      store.dispatch(onLogin(parsedProfile));
    } catch (err) {
      console.log('failed to parse profile');
    }
    return;
  }

  try {
    const snapshot = await getDoc(doc(db, 'profiles', uid));
    if (snapshot.exists()) {
      const userData = snapshot.data();
      store.dispatch(onLogin(userData as UserProfile));
      sessionStorage.setItem('profile', JSON.stringify(userData));
    } else store.dispatch(onLogout());
  } catch (err) {
    handleErrors(err, strings.auth.errors.loginFail);
    await logOut();
  }
};

export const createProfile = (displayName: string, email: string, uid: string) => {
  const userProfile = {
    displayName: displayName,
    email: email,
    createdAt: Date.now(),
  } as UserProfile;

  return setDoc(doc(db, 'profiles', uid), userProfile);
};

export const logOut = async () => {
  try {
    if (!auth.currentUser) {
      return;
    }

    await signOut(auth);
    store.dispatch(onLogout());

    window.location.href = '/';
  } catch (err) {
    console.log('logout failed: ', err);
  }
};
