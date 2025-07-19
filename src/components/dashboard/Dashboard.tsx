import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NicheScanner } from './NicheScanner';
import { DemandHeatmap } from './DemandHeatmap';
import { NicheResults } from './NicheResults';
import { NicheData } from '../../types';

export function Dashboard() {
  const [currentNiche, setCurrentNiche] = useState<NicheData | null>(null);

  const handleNicheAnalyzed = (niche: NicheData) => {
    setCurrentNiche(niche);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Discover Your Next Profitable Niche
          </h1>
          <p className="text-lg text-gray-600">
            AI-powered insights to find untapped opportunities in minutes
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Scanner */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <NicheScanner onNicheAnalyzed={handleNicheAnalyzed} />
          </motion.div>

          {/* Right Column - Results and Heatmap */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            <DemandHeatmap nicheData={currentNiche} />
            <NicheResults nicheData={currentNiche} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}