import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ⚠️ REMPLACER PAR VOS CLÉS FIREBASE ⚠️
// Récupérer depuis: Firebase Console -> Project Settings -> General -> Your apps -> Web app
const firebaseConfig = {
  apiKey: "AIzaSyC7VTujmihhtOeZbnvarzYPzSjVU-SYvBQ",
  authDomain: "fir-test-e72e9.firebaseapp.com",
  projectId: "fir-test-e72e9",
  storageBucket: "fir-test-e72e9.firebasestorage.app",
  messagingSenderId: "28144789029",
  appId: "1:28144789029:web:543890f7a6b072293141cc"
};

// Initialize Firebase (Singleton pattern)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
