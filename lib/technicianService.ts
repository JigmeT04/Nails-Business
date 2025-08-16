import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { app } from './firebase';

const db = getFirestore(app);

export interface Technician {
  id: string;
  name: string;
  email: string;
  businessName: string;
  description?: string;
  specialties: string[];
  services: Service[];
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  contact: {
    phone: string;
    instagram?: string;
    website?: string;
  };
  profileImage?: string;
  isActive: boolean;
  joinedDate: Date;
  rating: number;
  totalReviews: number;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // in minutes
  category: 'Design' | 'GELX' | 'Other';
  tier?: number;
  description?: string;
}

// Get all active technicians
export const getAllTechnicians = async (): Promise<Technician[]> => {
  try {
    const q = query(
      collection(db, 'technicians'), 
      where('isActive', '==', true),
      orderBy('name')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      joinedDate: doc.data().joinedDate?.toDate() || new Date()
    } as Technician));
  } catch (error) {
    console.error('Error fetching technicians:', error);
    return [];
  }
};

// Get technician by ID
export const getTechnicianById = async (technicianId: string): Promise<Technician | null> => {
  try {
    const docRef = doc(db, 'technicians', technicianId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        joinedDate: docSnap.data().joinedDate?.toDate() || new Date()
      } as Technician;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching technician:', error);
    return null;
  }
};

// Create or update technician profile
export const saveTechnicianProfile = async (technicianData: Omit<Technician, 'id'>): Promise<string> => {
  try {
    const docRef = doc(collection(db, 'technicians'));
    await setDoc(docRef, {
      ...technicianData,
      joinedDate: new Date(),
      rating: 0,
      totalReviews: 0
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error saving technician profile:', error);
    throw error;
  }
};

// Update technician profile
export const updateTechnicianProfile = async (technicianId: string, updates: Partial<Technician>): Promise<void> => {
  try {
    const docRef = doc(db, 'technicians', technicianId);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error('Error updating technician profile:', error);
    throw error;
  }
};

// Get technician's availability for a date range
export const getTechnicianAvailability = async (
  technicianId: string, 
  startDate: string, 
  endDate: string
): Promise<Record<string, string[]>> => {
  try {
    const availability: Record<string, string[]> = {};
    
    // Query the technician's availability subcollection
    const availabilityRef = collection(db, 'technicians', technicianId, 'availability');
    const querySnapshot = await getDocs(availabilityRef);
    
    querySnapshot.docs.forEach(doc => {
      const dateString = doc.id;
      if (dateString >= startDate && dateString <= endDate) {
        availability[dateString] = doc.data().slots || [];
      }
    });
    
    return availability;
  } catch (error) {
    console.error('Error fetching technician availability:', error);
    return {};
  }
};

// Save availability for a technician
export const saveTechnicianAvailability = async (
  technicianId: string,
  dateString: string,
  slots: string[]
): Promise<void> => {
  try {
    const docRef = doc(db, 'technicians', technicianId, 'availability', dateString);
    await setDoc(docRef, { slots });
  } catch (error) {
    console.error('Error saving technician availability:', error);
    throw error;
  }
};

// Get technician's appointments
export const getTechnicianAppointments = async (technicianId: string) => {
  try {
    const appointmentsRef = collection(db, 'technicians', technicianId, 'appointments');
    const q = query(appointmentsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      appointmentDate: doc.data().date
    }));
  } catch (error) {
    console.error('Error fetching technician appointments:', error);
    return [];
  }
};
