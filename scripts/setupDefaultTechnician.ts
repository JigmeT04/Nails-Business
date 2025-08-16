// This script sets up the initial technician data
// Run this once to migrate from the old single-admin system to multi-technician system

import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { app } from '../lib/firebase';

const db = getFirestore(app);

const defaultTechnician = {
  name: "YVD Nails",
  email: "admin@yvdnails.com",
  businessName: "YVD Professional Nail Studio",
  description: "Professional nail artistry with a focus on creative designs and quality gel extensions.",
  specialties: [
    "Gel Extensions", 
    "Nail Art & Design", 
    "French Manicures", 
    "Ombre Designs",
    "3D Nail Art"
  ],
  services: [
    {
      id: "design-tier-1",
      name: "Design Tier 1",
      price: 70,
      duration: 90,
      category: "Design" as const,
      tier: 1,
      description: "Basic nail art and simple designs"
    },
    {
      id: "design-tier-2", 
      name: "Design Tier 2",
      price: 80,
      duration: 105,
      category: "Design" as const,
      tier: 2,
      description: "Intermediate nail art with more detailed designs"
    },
    {
      id: "design-tier-3",
      name: "Design Tier 3", 
      price: 90,
      duration: 120,
      category: "Design" as const,
      tier: 3,
      description: "Advanced nail art with complex patterns"
    },
    {
      id: "design-tier-4",
      name: "Design Tier 4",
      price: 100,
      duration: 135,
      category: "Design" as const,
      tier: 4,
      description: "Premium nail art with intricate details and 3D elements"
    },
    {
      id: "gelx-tier-1",
      name: "GELX Tier 1",
      price: 85,
      duration: 120,
      category: "GELX" as const,
      tier: 1,
      description: "Basic gel extension with simple finish"
    },
    {
      id: "gelx-tier-2",
      name: "GELX Tier 2", 
      price: 95,
      duration: 135,
      category: "GELX" as const,
      tier: 2,
      description: "Gel extension with moderate design work"
    },
    {
      id: "gelx-tier-3",
      name: "GELX Tier 3",
      price: 105,
      duration: 150,
      category: "GELX" as const,
      tier: 3,
      description: "Advanced gel extension with detailed artwork"
    },
    {
      id: "gelx-tier-4",
      name: "GELX Tier 4",
      price: 115,
      duration: 165,
      category: "GELX" as const,
      tier: 4,
      description: "Premium gel extension with complex designs"
    },
    {
      id: "soak-off",
      name: "Soak Off",
      price: 20,
      duration: 30,
      category: "Other" as const,
      description: "Safe removal of existing nail enhancements"
    },
    {
      id: "removals",
      name: "Removals",
      price: 0,
      duration: 15,
      category: "Other" as const,
      description: "Quick removal service"
    }
  ],
  location: {
    address: "123 Main Street",
    city: "Your City",
    state: "State",
    zipCode: "12345"
  },
  contact: {
    phone: "(555) 123-4567",
    instagram: "@yvdnails",
    website: "https://yvdnails.com"
  },
  isActive: true,
  rating: 4.9,
  totalReviews: 0
};

export const initializeDefaultTechnician = async () => {
  try {
    const technicianRef = doc(db, 'technicians', 'yvd-nails-default');
    await setDoc(technicianRef, {
      ...defaultTechnician,
      joinedDate: new Date()
    });
    
    return 'yvd-nails-default';
  } catch (error) {
    console.error('Error creating default technician:', error);
    throw error;
  }
};

// Uncomment and run this function once to initialize
// initializeDefaultTechnician();
