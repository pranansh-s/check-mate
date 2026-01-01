import { Profile } from '@check-mate/shared/types';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import { auth, db } from '@/lib/firebase';
import { handleErrors } from '@/lib/utils/error';
import { onLogin, onLogout } from '@/redux/features/userSlice';
import { store } from '@/redux/store';

import { strings } from '@/constants/strings';

const UserService = {
  refreshProfile: async (uid: string) => {
    const cachedProfile = sessionStorage.getItem('profile');

    if (cachedProfile && cachedProfile !== 'undefined') {
      try {
        const parsedProfile = JSON.parse(cachedProfile) as Profile;
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
        store.dispatch(onLogin(userData as Profile));
        sessionStorage.setItem('profile', JSON.stringify(userData));
      } else store.dispatch(onLogout());
    } catch (err) {
      handleErrors(err, strings.auth.errors.loginFail);
      await UserService.logOut();
    }
  },

  logOut: async () => {
    try {
      if (!auth.currentUser) {
        return;
      }

      await signOut(auth);
      store.dispatch(onLogout());

      window.location.href = '/';
    } catch (err) {
      console.error('Failed logout: ', err);
    }
  },

  getUserId: () => {
    return auth.currentUser?.uid;
  },
};

export default UserService;
