import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GithubAuthProvider,
  signInWithPopup,
  UserCredential,
} from 'firebase/auth';

import { emptyPromiseFunction } from '@/utils/functionUtils';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// eslint-disable-next-line import/no-mutable-exports
let signInWithFirebase: () => Promise<UserCredential | void>;

if (import.meta.env.MODE === 'test') {
  signInWithFirebase = emptyPromiseFunction;
} else {
  // Initialize Firebase
  initializeApp(firebaseConfig);

  const auth = getAuth();
  const githubAuthProvider = new GithubAuthProvider();

  signInWithFirebase = (): Promise<UserCredential> =>
    signInWithPopup(auth, githubAuthProvider);
}

export { signInWithFirebase };
