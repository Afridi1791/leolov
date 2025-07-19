import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  getDoc, 
  setDoc,
  query,
  where,
  orderBy 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { User } from '../types';

export class AdminService {
  static async getAllUsers(): Promise<User[]> {
    try {
      const usersCollection = collection(db, 'users');
      const snapshot = await getDocs(usersCollection);
      
      return snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      } as User));
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  }

  static async updateUserSubscription(userId: string, newPlan: 'free' | 'premium'): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      const updateData: any = {
        'subscription.type': newPlan,
        'subscription.status': 'active',
        reportsLimit: newPlan === 'premium' ? 999999 : 2
      };

      if (newPlan === 'premium') {
        updateData['subscription.startDate'] = new Date();
      }

      await updateDoc(userRef, updateData);
    } catch (error) {
      console.error('Error updating user subscription:', error);
      throw new Error('Failed to update subscription');
    }
  }

  static async getStats(): Promise<{
    totalUsers: number;
    freeUsers: number;
    premiumUsers: number;
    totalReports: number;
  }> {
    try {
      const usersCollection = collection(db, 'users');
      const snapshot = await getDocs(usersCollection);
      
      let totalUsers = 0;
      let freeUsers = 0;
      let premiumUsers = 0;
      let totalReports = 0;

      snapshot.docs.forEach(doc => {
        const userData = doc.data() as User;
        totalUsers++;
        totalReports += userData.reportsUsed || 0;
        
        if (userData.subscription?.type === 'premium') {
          premiumUsers++;
        } else {
          freeUsers++;
        }
      });

      return {
        totalUsers,
        freeUsers,
        premiumUsers,
        totalReports
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        totalUsers: 0,
        freeUsers: 0,
        premiumUsers: 0,
        totalReports: 0
      };
    }
  }

  static async getApiKey(): Promise<string> {
    try {
      const configRef = doc(db, 'config', 'gemini');
      const configDoc = await getDoc(configRef);
      
      if (configDoc.exists()) {
        return configDoc.data().apiKey || '';
      }
      
      return '';
    } catch (error) {
      console.error('Error fetching API key:', error);
      return '';
    }
  }

  static async updateApiKey(newApiKey: string): Promise<void> {
    try {
      const configRef = doc(db, 'config', 'gemini');
      await setDoc(configRef, { 
        apiKey: newApiKey,
        updatedAt: new Date()
      }, { merge: true });
      
      // Update the runtime API key
      if (typeof window !== 'undefined') {
        (window as any).GEMINI_API_KEY = newApiKey;
      }
    } catch (error) {
      console.error('Error updating API key:', error);
      throw new Error('Failed to update API key');
    }
  }
}