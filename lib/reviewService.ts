import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  updateDoc, 
  doc, 
  serverTimestamp,
  getDoc,
  setDoc,
  increment 
} from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { app } from './firebase';

const db = getFirestore(app);

export interface Review {
  id: string;
  userId: string;
  customerName: string;
  service: string;
  technician: string;
  rating: number; // 1-5 stars
  comment: string;
  createdAt: any;
  appointmentId?: string;
  verified: boolean; // true if from actual appointment
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number }; // e.g., { 5: 10, 4: 5, 3: 2, 2: 1, 1: 0 }
}

export interface ServiceStats extends ReviewStats {
  serviceName: string;
}

export interface TechnicianStats extends ReviewStats {
  technicianName: string;
}

export class ReviewService {
  // Submit a new review
  static async submitReview(reviewData: {
    userId: string;
    customerName: string;
    service: string;
    technician: string;
    rating: number;
    comment: string;
    appointmentId?: string;
  }): Promise<void> {
    try {
      const review = {
        ...reviewData,
        createdAt: serverTimestamp(),
        verified: !!reviewData.appointmentId, // verified if linked to appointment
      };

      await addDoc(collection(db, 'reviews'), review);

      // Update service stats
      await this.updateServiceStats(reviewData.service, reviewData.rating);

      // Update technician stats
      await this.updateTechnicianStats(reviewData.technician, reviewData.rating);

    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  }

  // Get reviews for a specific service
  static async getServiceReviews(serviceName: string): Promise<Review[]> {
    try {
      const q = query(
        collection(db, 'reviews'),
        where('service', '==', serviceName),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Review));
    } catch (error) {
      console.error('Error getting service reviews:', error);
      return [];
    }
  }

  // Get reviews for a specific technician
  static async getTechnicianReviews(technicianName: string): Promise<Review[]> {
    try {
      const q = query(
        collection(db, 'reviews'),
        where('technician', '==', technicianName),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Review));
    } catch (error) {
      console.error('Error getting technician reviews:', error);
      return [];
    }
  }

  // Get all reviews (for admin)
  static async getAllReviews(): Promise<Review[]> {
    try {
      const q = query(
        collection(db, 'reviews'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Review));
    } catch (error) {
      console.error('Error getting all reviews:', error);
      return [];
    }
  }

  // Get service statistics
  static async getServiceStats(serviceName: string): Promise<ServiceStats> {
    try {
      const statsDoc = await getDoc(doc(db, 'serviceStats', serviceName));
      
      if (statsDoc.exists()) {
        return {
          serviceName,
          ...statsDoc.data()
        } as ServiceStats;
      }
      
      return {
        serviceName,
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: {}
      };
    } catch (error) {
      console.error('Error getting service stats:', error);
      return {
        serviceName,
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: {}
      };
    }
  }

  // Get technician statistics
  static async getTechnicianStats(technicianName: string): Promise<TechnicianStats> {
    try {
      const statsDoc = await getDoc(doc(db, 'technicianStats', technicianName));
      
      if (statsDoc.exists()) {
        return {
          technicianName,
          ...statsDoc.data()
        } as TechnicianStats;
      }
      
      return {
        technicianName,
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: {}
      };
    } catch (error) {
      console.error('Error getting technician stats:', error);
      return {
        technicianName,
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: {}
      };
    }
  }

  // Update service statistics
  private static async updateServiceStats(serviceName: string, rating: number): Promise<void> {
    try {
      const statsRef = doc(db, 'serviceStats', serviceName);
      const statsDoc = await getDoc(statsRef);

      if (statsDoc.exists()) {
        const currentStats = statsDoc.data();
        const newTotalReviews = (currentStats.totalReviews || 0) + 1;
        const currentTotal = (currentStats.averageRating || 0) * (currentStats.totalReviews || 0);
        const newAverage = (currentTotal + rating) / newTotalReviews;
        
        const ratingDistribution = currentStats.ratingDistribution || {};
        ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;

        await updateDoc(statsRef, {
          averageRating: newAverage,
          totalReviews: newTotalReviews,
          ratingDistribution,
          lastUpdated: serverTimestamp()
        });
      } else {
        await setDoc(statsRef, {
          averageRating: rating,
          totalReviews: 1,
          ratingDistribution: { [rating]: 1 },
          lastUpdated: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error updating service stats:', error);
    }
  }

  // Update technician statistics
  private static async updateTechnicianStats(technicianName: string, rating: number): Promise<void> {
    try {
      const statsRef = doc(db, 'technicianStats', technicianName);
      const statsDoc = await getDoc(statsRef);

      if (statsDoc.exists()) {
        const currentStats = statsDoc.data();
        const newTotalReviews = (currentStats.totalReviews || 0) + 1;
        const currentTotal = (currentStats.averageRating || 0) * (currentStats.totalReviews || 0);
        const newAverage = (currentTotal + rating) / newTotalReviews;
        
        const ratingDistribution = currentStats.ratingDistribution || {};
        ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;

        await updateDoc(statsRef, {
          averageRating: newAverage,
          totalReviews: newTotalReviews,
          ratingDistribution,
          lastUpdated: serverTimestamp()
        });
      } else {
        await setDoc(statsRef, {
          averageRating: rating,
          totalReviews: 1,
          ratingDistribution: { [rating]: 1 },
          lastUpdated: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error updating technician stats:', error);
    }
  }

  // Get user's reviews
  static async getUserReviews(userId: string): Promise<Review[]> {
    try {
      const q = query(
        collection(db, 'reviews'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Review));
    } catch (error) {
      console.error('Error getting user reviews:', error);
      return [];
    }
  }
}
