import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCZj_mEaPZ_f0hkoFhoRJcVFX56FqZgT-A",
  authDomain: "car-tracker-4b750.firebaseapp.com",
  projectId: "car-tracker-4b750",
  storageBucket: "car-tracker-4b750.firebasestorage.app",
  messagingSenderId: "1094723164767",
  appId: "1:1094723164767:web:a8d316b60f5e2e228959ea",
  measurementId: "G-BFS648K26K"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);