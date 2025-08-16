'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import ReviewForm from '@/app/components/ReviewForm';
import ReviewDisplay from '@/app/components/ReviewDisplay';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Star, Users, Award } from 'lucide-react';
import LoadingPage from '@/app/components/LoadingSpinner';
import { Toaster } from '@/components/ui/sonner';

export default function ReviewsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'services' | 'technicians'>('all');

  if (loading) {
    return <LoadingPage text="Loading reviews..." />;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    // Trigger a refresh of the reviews display
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light-gray to-brand-nude py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-title text-4xl font-semibold text-brand-taupe mb-4 tracking-wider">
            Reviews & Ratings
          </h1>
          <p className="font-body text-brand-taupe-light text-lg mb-8">
            Share your experience and help others discover our exceptional nail artistry
          </p>
          
          {!showReviewForm && (
            <Button
              onClick={() => setShowReviewForm(true)}
              className="bg-brand-taupe hover:bg-brand-taupe-dark text-brand-cream px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Write a Review
            </Button>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <div className="mb-12">
            <ReviewForm
              onSubmitSuccess={handleReviewSubmitted}
              onCancel={() => setShowReviewForm(false)}
            />
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center bg-white border-brand-pink/20 hover:shadow-lg transition-shadow duration-300">
            <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="font-title text-lg font-semibold text-brand-taupe mb-2">
              Quality Services
            </h3>
            <p className="text-brand-taupe-light text-sm">
              Professional nail artistry with exceptional attention to detail
            </p>
          </Card>

          <Card className="p-6 text-center bg-white border-brand-pink/20 hover:shadow-lg transition-shadow duration-300">
            <Users className="w-12 h-12 text-brand-taupe mx-auto mb-4" />
            <h3 className="font-title text-lg font-semibold text-brand-taupe mb-2">
              Expert Technicians
            </h3>
            <p className="text-brand-taupe-light text-sm">
              Skilled professionals dedicated to your nail care experience
            </p>
          </Card>

          <Card className="p-6 text-center bg-white border-brand-pink/20 hover:shadow-lg transition-shadow duration-300">
            <Award className="w-12 h-12 text-brand-pink mx-auto mb-4" />
            <h3 className="font-title text-lg font-semibold text-brand-taupe mb-2">
              Customer Satisfaction
            </h3>
            <p className="text-brand-taupe-light text-sm">
              Your satisfaction is our top priority and commitment
            </p>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-1 shadow-lg border border-brand-pink/20">
            <Button
              variant={activeTab === 'all' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('all')}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'all' 
                  ? 'bg-brand-taupe text-brand-cream shadow-md' 
                  : 'text-brand-taupe hover:bg-brand-light-gray'
              }`}
            >
              All Reviews
            </Button>
            <Button
              variant={activeTab === 'services' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('services')}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'services' 
                  ? 'bg-brand-taupe text-brand-cream shadow-md' 
                  : 'text-brand-taupe hover:bg-brand-light-gray'
              }`}
            >
              By Service
            </Button>
            <Button
              variant={activeTab === 'technicians' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('technicians')}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'technicians' 
                  ? 'bg-brand-taupe text-brand-cream shadow-md' 
                  : 'text-brand-taupe hover:bg-brand-light-gray'
              }`}
            >
              By Technician
            </Button>
          </div>
        </div>

        {/* Reviews Display */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl border border-brand-pink/20">
          {activeTab === 'all' && (
            <ReviewDisplay 
              type="all" 
              showStats={false}
            />
          )}
          
          {activeTab === 'services' && (
            <div className="space-y-8">
              <h2 className="font-title text-2xl font-semibold text-brand-taupe text-center mb-8">
                Service Reviews
              </h2>
              {['Design Tier 1', 'Design Tier 2', 'Design Tier 3', 'Design Tier 4'].map(service => (
                <div key={service}>
                  <ReviewDisplay 
                    type="service" 
                    filterValue={service}
                    showStats={true}
                    maxReviews={3}
                  />
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'technicians' && (
            <div className="space-y-8">
              <h2 className="font-title text-2xl font-semibold text-brand-taupe text-center mb-8">
                Technician Reviews
              </h2>
              {['Sarah Chen', 'Maria Rodriguez', 'Ashley Kim', 'Jennifer Lee'].map(technician => (
                <div key={technician}>
                  <ReviewDisplay 
                    type="technician" 
                    filterValue={technician}
                    showStats={true}
                    maxReviews={3}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Toaster />
    </div>
  );
}
