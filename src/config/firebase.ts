import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAegfujgaEAS9pXcTlUivs6JJrtYI0Bg0E",
  authDomain: "team-pulse-pro.firebaseapp.com",
  projectId: "team-pulse-pro",
  storageBucket: "team-pulse-pro.firebasestorage.app",
  messagingSenderId: "768248182495",
  appId: "1:768248182495:web:7d3bfa814ddec6b924db6a",
  measurementId: "G-W541LSBDVY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;