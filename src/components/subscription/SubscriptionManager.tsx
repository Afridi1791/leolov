import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, CreditCard, Calendar, Check } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export function SubscriptionManager() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      // Here you would integrate with Stripe
      // For demo purposes, we'll simulate an upgrade
      toast.success('Subscription upgrade initiated!');
      
      // In a real app, you'd redirect to Stripe checkout
      // const stripe = await loadStripe('your-stripe-publishable-key');
      // const response = await fetch('/api/create-checkout-session', {...});
      // const session = await response.json();
      // await stripe.redirectToCheckout({ sessionId: session.id });
      
    } catch (error) {
      toast.error('Failed to process upgrade');
    } finally {
      setLoading(false);
    }
  };

  const premiumFeatures = [
    'Unlimited niche analyses',
    'Advanced demand heatmaps',
    'Detailed validation reports',
    'Competitor tracking',
    'Priority support',
    'API access',
    'Custom exports',
    'Trend alerts'
  ];

  if (!currentUser) {
    return null;
  }

  const isPremium = currentUser.subscription?.type === 'premium';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription Management</h1>
        <p className="text-gray-600">Manage your NicheNav subscription and billing</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Plan */}
        <Card className="p-6">
          <div className="flex items-center mb-4">
            {isPremium ? (
              <Crown className="w-6 h-6 text-yellow-600 mr-2" />
            ) : (
              <CreditCard className="w-6 h-6 text-gray-600 mr-2" />
            )}
            <h2 className="text-xl font-semibold text-gray-900">Current Plan</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Plan Type</span>
              <span className={`font-medium px-3 py-1 rounded-full text-sm ${
                isPremium 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {isPremium ? 'Premium' : 'Free'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Reports Used</span>
              <span className="font-medium">
                {currentUser.reportsUsed} / {isPremium ? '∞' : currentUser.reportsLimit}
              </span>
            </div>

            {isPremium && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Next Billing</span>
                <span className="font-medium">
                  {currentUser.subscription?.endDate 
                    ? new Date(currentUser.subscription.endDate).toLocaleDateString()
                    : 'N/A'
                  }
                </span>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {isPremium ? '$9' : '$0'}
                <span className="text-base font-normal text-gray-600">
                  /month
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Upgrade/Features */}
        {!isPremium ? (
          <Card className="p-6 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="text-center mb-6">
              <Crown className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Upgrade to Premium</h2>
              <p className="text-gray-600">Unlock unlimited niche discovery potential</p>
            </div>

            <ul className="space-y-3 mb-6">
              {premiumFeatures.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={handleUpgrade}
              loading={loading}
              className="w-full"
              size="lg"
            >
              Upgrade to Premium - $9/month
            </Button>
          </Card>
        ) : (
          <Card className="p-6">
            <div className="text-center mb-6">
              <Crown className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Premium Active</h2>
              <p className="text-gray-600">You have access to all premium features</p>
            </div>

            <div className="space-y-4">
              <Button variant="outline" className="w-full">
                <Calendar className="w-4 h-4 mr-2" />
                Manage Billing
              </Button>
              
              <Button variant="ghost" className="w-full text-red-600 hover:text-red-700">
                Cancel Subscription
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Usage Stats */}
      <Card className="p-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {currentUser.reportsUsed}
            </div>
            <div className="text-gray-600">Reports Generated</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {Math.max(0, currentUser.reportsLimit - currentUser.reportsUsed)}
            </div>
            <div className="text-gray-600">Reports Remaining</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {new Date(currentUser.createdAt).toLocaleDateString()}
            </div>
            <div className="text-gray-600">Member Since</div>
          </div>
        </div>
      </Card>
    </div>
  );
}