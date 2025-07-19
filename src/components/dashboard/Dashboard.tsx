import React, { useState } from 'react';
import { NicheScanner } from './NicheScanner';
import { DemandHeatmap } from './DemandHeatmap';
import { NicheResults } from './NicheResults';
import { NicheData } from '../../types';
import { TrendingUp, Zap, Target } from 'lucide-react';

export function Dashboard() {
  const [currentNiche, setCurrentNiche] = useState<NicheData | null>(null);

  const handleNicheAnalyzed = (niche: NicheData) => {
    setCurrentNiche(niche);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container-responsive py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-4">
            <Zap className="w-4 h-4 mr-2" />
            AI-Powered Market Intelligence
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Discover Your Next{' '}
            <span className="text-gradient">Profitable Niche</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Advanced AI insights to find untapped opportunities in minutes
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { icon: TrendingUp, label: 'Market Trends', value: 'Real-time', color: 'bg-blue-600' },
            { icon: Target, label: 'Precision', value: '98% Accuracy', color: 'bg-purple-600' },
            { icon: Zap, label: 'Speed', value: '< 2 Minutes', color: 'bg-green-600' }
          ].map((stat, index) => (
            <div key={index} className="card p-6 text-center">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Scanner */}
          <div className="lg:col-span-4">
            <NicheScanner onNicheAnalyzed={handleNicheAnalyzed} />
          </div>

          {/* Right Column - Results and Heatmap */}
          <div className="lg:col-span-8 space-y-8">
            <DemandHeatmap nicheData={currentNiche} />
            <NicheResults nicheData={currentNiche} />
          </div>
        </div>
      </div>
    </div>
  );
}