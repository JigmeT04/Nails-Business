import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { app } from './firebase';

const db = getFirestore(app);

export interface LoyaltyData {
  points: number;
  totalSpent: number;
  appointmentsCompleted: number;
  tierLevel: string;
  lastUpdated: Date;
}

export class LoyaltyService {
  // Calculate points based on service price
  static calculatePointsFromPrice(price: number): number {
    return Math.floor(price * 10); // 10 points per $1
  }

  // Calculate points for appointment completion
  static getCompletionBonus(): number {
    return 50; // 50 bonus points for completing an appointment
  }

  // Get service price from service name
  static getServicePrice(serviceName: string): number {
    const servicePrices: { [key: string]: number } = {
      'Design Tier 1': 70,
      'Design Tier 2': 80,
      'Design Tier 3': 90,
      'Design Tier 4': 100,
      'GELX Tier 1 ($85)': 85,
      'GELX Tier 2 ($95)': 95,
      'GELX Tier 3 ($105)': 105,
      'GELX Tier 4 ($115)': 115,
      'Soak Off ($20)': 20,
      'Removals ($0)': 0,
    };
    
    return servicePrices[serviceName] || 0;
  }

  // Get user's loyalty data
  static async getUserLoyaltyData(userId: string): Promise<LoyaltyData> {
    try {
      const loyaltyDocRef = doc(db, 'loyalty', userId);
      const loyaltyDoc = await getDoc(loyaltyDocRef);
      
      if (loyaltyDoc.exists()) {
        return loyaltyDoc.data() as LoyaltyData;
      } else {
        // Create initial loyalty data
        const initialData: LoyaltyData = {
          points: 0,
          totalSpent: 0,
          appointmentsCompleted: 0,
          tierLevel: 'Welcome',
          lastUpdated: new Date(),
        };
        
        await setDoc(loyaltyDocRef, initialData);
        return initialData;
      }
    } catch (error) {
      console.error('Error getting loyalty data:', error);
      throw error;
    }
  }

  // Award points for a completed appointment
  static async awardPointsForAppointment(userId: string, serviceName: string): Promise<number> {
    try {
      const servicePrice = this.getServicePrice(serviceName);
      const servicePoints = this.calculatePointsFromPrice(servicePrice);
      const completionBonus = this.getCompletionBonus();
      const totalPoints = servicePoints + completionBonus;

      const loyaltyDocRef = doc(db, 'loyalty', userId);
      
      // Ensure the loyalty document exists before updating
      const loyaltyDoc = await getDoc(loyaltyDocRef);
      if (!loyaltyDoc.exists()) {
        // Create initial loyalty data
        const initialData: LoyaltyData = {
          points: 0,
          totalSpent: 0,
          appointmentsCompleted: 0,
          tierLevel: 'Welcome',
          lastUpdated: new Date(),
        };
        await setDoc(loyaltyDocRef, initialData);
      }
      
      await updateDoc(loyaltyDocRef, {
        points: increment(totalPoints),
        totalSpent: increment(servicePrice),
        appointmentsCompleted: increment(1),
        lastUpdated: new Date(),
      });

      // Update tier level
      const updatedData = await this.getUserLoyaltyData(userId);
      const newTier = this.calculateTierLevel(updatedData.points);
      
      if (newTier !== updatedData.tierLevel) {
        await updateDoc(loyaltyDocRef, { tierLevel: newTier });
      }

      return totalPoints;
    } catch (error) {
      console.error('Error awarding points:', error);
      throw error;
    }
  }

  // Redeem points for discount
  static async redeemPoints(userId: string, pointsToRedeem: number): Promise<boolean> {
    try {
      const loyaltyData = await this.getUserLoyaltyData(userId);
      
      if (loyaltyData.points >= pointsToRedeem) {
        const loyaltyDocRef = doc(db, 'loyalty', userId);
        await updateDoc(loyaltyDocRef, {
          points: increment(-pointsToRedeem),
          lastUpdated: new Date(),
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error redeeming points:', error);
      throw error;
    }
  }

  // Calculate tier level based on points
  static calculateTierLevel(points: number): string {
    if (points >= 1000) return 'Platinum';
    if (points >= 500) return 'Gold';
    if (points >= 250) return 'Silver';
    if (points >= 100) return 'Bronze';
    return 'Welcome';
  }

  // Get discount percentage based on tier
  static getTierDiscount(tierLevel: string): number {
    const discounts: { [key: string]: number } = {
      'Welcome': 0,
      'Bronze': 5,
      'Silver': 10,
      'Gold': 15,
      'Platinum': 20,
    };
    
    return discounts[tierLevel] || 0;
  }
}
