import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCLwz7LmZDd7DdreCLn8nt8tFPWDYklNoM',
  authDomain: 'check-and-mate-26c90.firebaseapp.com',
  projectId: 'check-and-mate-26c90',
  storageBucket: 'check-and-mate-26c90.firebasestorage.app',
  messagingSenderId: '791182251950',
  appId: '1:791182251950:web:e15933d7c6ebbac3515a3f',
  measurementId: 'G-6GV7MVVKDM',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
