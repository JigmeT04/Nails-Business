import React from 'react';
import { Star, Gift, Award } from 'lucide-react';

interface LoyaltyCardProps {
  points: number;
  nextReward: number;
  onRedeem?: (discount: number) => void;
}

const LOYALTY_TIERS = [
  { points: 0, name: "Welcome", discount: 0, color: "from-gray-400 to-gray-500" },
  { points: 100, name: "Bronze", discount: 5, color: "from-amber-600 to-amber-700" },
  { points: 250, name: "Silver", discount: 10, color: "from-gray-400 to-gray-500" },
  { points: 500, name: "Gold", discount: 15, color: "from-yellow-400 to-yellow-500" },
  { points: 1000, name: "Platinum", discount: 20, color: "from-purple-400 to-purple-500" },
];

const REWARDS = [
  { points: 100, discount: 5, name: "5% Off Next Service" },
  { points: 200, discount: 10, name: "10% Off Next Service" },
  { points: 300, discount: 15, name: "15% Off Next Service" },
  { points: 500, discount: 20, name: "20% Off Next Service" },
];

export default function LoyaltyCard({ points, nextReward, onRedeem }: LoyaltyCardProps) {
  const currentTier = LOYALTY_TIERS.reduce((prev, curr) => 
    points >= curr.points ? curr : prev
  );
  
  const nextTier = LOYALTY_TIERS.find(tier => tier.points > points);
  const availableRewards = REWARDS.filter(reward => points >= reward.points);
  
  const progressToNext = nextTier 
    ? ((points - currentTier.points) / (nextTier.points - currentTier.points)) * 100
    : 100;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-brand-pink-soft/20 overflow-hidden">
      {/* Header */}
      <div className={`bg-gradient-to-r ${currentTier.color} p-6 text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-title text-2xl font-semibold tracking-wider">
              {currentTier.name} Member
            </h3>
            <p className="font-body text-sm opacity-90">YVD Nails Loyalty</p>
          </div>
          <Award className="w-8 h-8" />
        </div>
      </div>

      {/* Points Display */}
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand-taupe to-brand-taupe-dark rounded-full mb-4">
            <Star className="w-10 h-10 text-brand-cream fill-current" />
          </div>
          <h4 className="font-title text-3xl font-semibold text-brand-taupe mb-2">
            {points}
          </h4>
          <p className="font-body text-brand-taupe-light">Loyalty Points</p>
        </div>

        {/* Progress to Next Tier */}
        {nextTier && (
          <div className="mb-6">
            <div className="flex justify-between text-sm font-body text-brand-taupe-light mb-2">
              <span>{currentTier.name}</span>
              <span>{nextTier.name}</span>
            </div>
            <div className="w-full bg-brand-pink-soft rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-brand-taupe to-brand-taupe-dark h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressToNext}%` }}
              ></div>
            </div>
            <p className="text-xs font-body text-brand-taupe-light mt-2 text-center">
              {nextTier.points - points} points to {nextTier.name}
            </p>
          </div>
        )}

        {/* Available Rewards */}
        {availableRewards.length > 0 && (
          <div>
            <h5 className="font-title text-lg font-semibold text-brand-taupe mb-4 flex items-center gap-2">
              <Gift className="w-5 h-5" />
              Available Rewards
            </h5>
            <div className="space-y-3">
              {availableRewards.map((reward) => (
                <div key={reward.points} className="flex items-center justify-between p-3 bg-brand-pink-soft/30 rounded-lg">
                  <div>
                    <p className="font-body font-medium text-brand-taupe">{reward.name}</p>
                    <p className="font-body text-sm text-brand-taupe-light">{reward.points} points</p>
                  </div>
                  <button
                    onClick={() => onRedeem?.(reward.discount)}
                    className="px-4 py-2 bg-brand-taupe hover:bg-brand-taupe-dark text-brand-cream rounded-full text-sm font-semibold transition-colors"
                  >
                    Redeem
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* How to Earn Points */}
        <div className="mt-6 p-4 bg-brand-cream rounded-lg">
          <h6 className="font-title font-semibold text-brand-taupe mb-2">How to Earn Points</h6>
          <ul className="font-body text-sm text-brand-taupe-light space-y-1">
            <li>• 10 points per $1 spent on services</li>
            <li>• 50 bonus points for each completed appointment</li>
            <li>• 100 bonus points for referrals</li>
            <li>• Special bonus point events</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
