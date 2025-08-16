'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Phone, Instagram, Globe } from 'lucide-react';
import { Technician, getAllTechnicians } from '@/lib/technicianService';
import LoadingSpinner from './LoadingSpinner';

interface TechnicianSelectorProps {
  onSelect: (technician: Technician) => void;
  selectedTechnician?: Technician | null;
}

export default function TechnicianSelector({ onSelect, selectedTechnician }: TechnicianSelectorProps) {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const techs = await getAllTechnicians();
        setTechnicians(techs);
      } catch (error) {
        console.error('Error fetching technicians:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicians();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <LoadingSpinner />
        <p className="mt-2 text-gray-600">Loading technicians...</p>
      </div>
    );
  }

  if (technicians.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-600">No technicians available at the moment.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Select Your Nail Technician</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {technicians.map((technician) => (
          <Card 
            key={technician.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedTechnician?.id === technician.id ? 'ring-2 ring-rose-500 border-rose-500' : ''
            }`}
            onClick={() => onSelect(technician)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{technician.name}</CardTitle>
                  <p className="text-sm font-medium text-rose-600">{technician.businessName}</p>
                </div>
                {technician.rating > 0 && (
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{technician.rating.toFixed(1)}</span>
                    <span className="text-gray-500">({technician.totalReviews})</span>
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              {technician.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{technician.description}</p>
              )}
              
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{technician.location.city}, {technician.location.state}</span>
                </div>
                
                {technician.contact.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{technician.contact.phone}</span>
                  </div>
                )}
              </div>

              {technician.specialties.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-700 mb-1">Specialties:</p>
                  <div className="flex flex-wrap gap-1">
                    {technician.specialties.slice(0, 3).map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                    {technician.specialties.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{technician.specialties.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {technician.services.length} services available
                </div>
                
                <div className="flex gap-2">
                  {technician.contact.instagram && (
                    <Instagram className="w-4 h-4 text-gray-400" />
                  )}
                  {technician.contact.website && (
                    <Globe className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>

              {selectedTechnician?.id === technician.id && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm font-medium text-green-600">✓ Selected</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
