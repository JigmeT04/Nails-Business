'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
}

export default function StarRating({ 
  rating, 
  onRatingChange, 
  readonly = false, 
  size = 'md',
  showNumber = false 
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleStarClick = (starRating: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const handleStarHover = (starRating: number) => {
    if (!readonly) {
      setHoverRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center" onMouseLeave={handleMouseLeave}>
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= displayRating;
          const isPartiallyFilled = star - 0.5 <= displayRating && displayRating < star;
          
          return (
            <button
              key={star}
              type="button"
              disabled={readonly}
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => handleStarHover(star)}
              className={`
                ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} 
                transition-all duration-200 disabled:cursor-default
              `}
            >
              <Star
                className={`
                  ${sizeClasses[size]}
                  ${isFilled 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : isPartiallyFilled 
                    ? 'fill-yellow-400/50 text-yellow-400' 
                    : 'fill-gray-200 text-gray-300'
                  }
                  transition-colors duration-200
                `}
              />
            </button>
          );
        })}
      </div>
      {showNumber && (
        <span className="ml-2 text-sm font-medium text-brand-taupe">
          {rating.toFixed(1)} / 5
        </span>
      )}
    </div>
  );
}
