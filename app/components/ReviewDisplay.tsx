'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Review, ReviewService, ServiceStats, TechnicianStats } from '@/lib/reviewService';
import StarRating from './StarRating';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Verified } from 'lucide-react';

interface ReviewDisplayProps {
  type: 'service' | 'technician' | 'all';
  filterValue?: string; // service name or technician name
  showStats?: boolean;
  maxReviews?: number;
}

export default function ReviewDisplay({ 
  type, 
  filterValue, 
  showStats = true,
  maxReviews 
}: ReviewDisplayProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ServiceStats | TechnicianStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [type, filterValue]);

  const fetchReviews = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let fetchedReviews: Review[] = [];
      let fetchedStats = null;

      if (type === 'service' && filterValue) {
        fetchedReviews = await ReviewService.getServiceReviews(filterValue);
        if (showStats) {
          fetchedStats = await ReviewService.getServiceStats(filterValue);
        }
      } else if (type === 'technician' && filterValue) {
        fetchedReviews = await ReviewService.getTechnicianReviews(filterValue);
        if (showStats) {
          fetchedStats = await ReviewService.getTechnicianStats(filterValue);
        }
      } else if (type === 'all') {
        fetchedReviews = await ReviewService.getAllReviews();
      }

      // Limit reviews if maxReviews is specified
      if (maxReviews && fetchedReviews.length > maxReviews) {
        fetchedReviews = fetchedReviews.slice(0, maxReviews);
      }

      setReviews(fetchedReviews);
      setStats(fetchedStats);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" text="Loading reviews..." />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        title="Failed to Load Reviews"
        message={error}
        onRetry={fetchReviews}
        showRetry={true}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      {showStats && stats && stats.totalReviews > 0 && (
        <Card className="p-6 bg-gradient-to-r from-brand-light-gray to-brand-nude border-brand-pink/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-title text-xl font-semibold text-brand-taupe mb-2">
                {type === 'service' ? `${filterValue} Reviews` : `${filterValue} Reviews`}
              </h3>
              <div className="flex items-center gap-4">
                <StarRating 
                  rating={stats.averageRating} 
                  readonly 
                  size="lg" 
                  showNumber 
                />
                <span className="text-brand-taupe-light">
                  Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            
            {/* Rating Distribution */}
            <div className="text-right">
              <div className="text-sm text-brand-taupe-light mb-2">Rating Distribution</div>
              {[5, 4, 3, 2, 1].map(rating => {
                const count = stats.ratingDistribution[rating] || 0;
                const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                
                return (
                  <div key={rating} className="flex items-center gap-2 mb-1">
                    <span className="text-xs w-6">{rating}★</span>
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-400 transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-brand-taupe-light w-8">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-brand-taupe-light text-lg">
            No reviews yet. Be the first to leave a review!
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h4 className="font-title text-lg font-semibold text-brand-taupe">
            Customer Reviews ({reviews.length})
          </h4>
          
          {reviews.map(review => (
            <Card key={review.id} className="p-6 hover:shadow-lg transition-shadow duration-300 border-brand-pink/20">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-taupe rounded-full flex items-center justify-center">
                    <span className="text-brand-cream font-semibold text-sm">
                      {review.customerName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-brand-taupe">
                        {review.customerName}
                      </span>
                      {review.verified && (
                        <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                          <Verified className="w-3 h-3" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-brand-taupe-light">
                      {review.createdAt && format(review.createdAt.toDate(), 'MMM d, yyyy')}
                    </div>
                  </div>
                </div>
                
                <StarRating rating={review.rating} readonly size="sm" />
              </div>

              <div className="mb-4">
                <div className="flex gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {review.service}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {review.technician}
                  </Badge>
                </div>
                <p className="text-brand-taupe leading-relaxed">
                  {review.comment}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
