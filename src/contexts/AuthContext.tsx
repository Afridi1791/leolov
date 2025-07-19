import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User } from '../types';
import toast from 'react-hot-toast';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loading: boolean;
  canGenerateReport: () => boolean;
  incrementReportUsage: () => Promise<void>;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });

  const createUserDocument = async (firebaseUser: FirebaseUser, additionalData?: any) => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const userData: Omit<User, 'uid'> = {
        email: firebaseUser.email!,
        displayName: firebaseUser.displayName || additionalData?.displayName,
        photoURL: firebaseUser.photoURL,
        subscription: {
          type: 'free',
          status: 'active',
          startDate: new Date(),
        },
        reportsUsed: 0,
        reportsLimit: 2,
        createdAt: new Date(),
      };

      await setDoc(userRef, userData);
      return { uid: firebaseUser.uid, ...userData } as User;
    }

    const userData = userSnap.data() as Omit<User, 'uid'>;
    return { uid: firebaseUser.uid, ...userData } as User;
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Welcome back!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await createUserDocument(result.user);
      toast.success('Welcome to NicheNav!');
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user') {
        toast.error(error.message);
      }
      throw error;
    }
  };

  const signup = async (email: string, password: string, displayName?: string) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await createUserDocument(user, { displayName });
      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const canGenerateReport = () => {
    if (!currentUser) return false;
    if (currentUser.subscription?.type === 'premium') return true;
    return currentUser.reportsUsed < currentUser.reportsLimit;
  };

  const incrementReportUsage = async () => {
    if (!currentUser) return;

    const userRef = doc(db, 'users', currentUser.uid);
    const newUsage = currentUser.reportsUsed + 1;
    
    await updateDoc(userRef, { reportsUsed: newUsage });
    setCurrentUser({ ...currentUser, reportsUsed: newUsage });
  };

  const isAdmin = () => {
    return currentUser?.email === 'afridi7861791@gmail.com';
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const user = await createUserDocument(firebaseUser);
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    loginWithGoogle,
    signup,
    logout,
    resetPassword,
    loading,
    canGenerateReport,
    incrementReportUsage,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}