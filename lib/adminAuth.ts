import { getFirestore, doc, getDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { app } from './firebase';

const db = getFirestore(app);

export interface AdminSession {
  technicianId: string;
  technician: any;
  isOwner: boolean; // If they can manage other technicians
}

export const getAdminSession = async (userEmail: string): Promise<AdminSession | null> => {
  try {
    // Find technician by email
    const techniciansRef = collection(db, 'technicians');
    const q = query(techniciansRef, where('email', '==', userEmail), where('isActive', '==', true));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const technicianDoc = querySnapshot.docs[0];
      const technicianData = technicianDoc.data();
      
      return {
        technicianId: technicianDoc.id,
        technician: {
          id: technicianDoc.id,
          ...technicianData,
          joinedDate: technicianData.joinedDate?.toDate() || new Date()
        },
        isOwner: technicianData.isOwner || false
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting admin session:', error);
    return null;
  }
};

export const requireAdmin = async (userEmail: string): Promise<AdminSession> => {
  const session = await getAdminSession(userEmail);
  if (!session) {
    throw new Error('Access denied: Admin privileges required');
  }
  return session;
};
