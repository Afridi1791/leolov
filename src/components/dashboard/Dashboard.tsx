import React, { useState } from 'react';
import { motion } from 'framer-motion';
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 pt-20">
      <div className="container-responsive section-padding">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-semibold mb-6">
              <Zap className="w-4 h-4 mr-2" />
              AI-Powered Market Intelligence
            </div>
            
            <h1 className="text-responsive-xl font-black text-gray-900 mb-4">
              Discover Your Next{' '}
              <span className="text-gradient">Profitable Niche</span>
            </h1>
            <p className="text-responsive-md text-gray-600 max-w-3xl mx-auto font-medium">
              Advanced AI insights to find untapped opportunities in minutes, not months
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {[
              { icon: TrendingUp, label: 'Market Trends', value: 'Real-time', color: 'from-blue-500 to-blue-600' },
              { icon: Target, label: 'Precision', value: '98% Accuracy', color: 'from-purple-500 to-purple-600' },
              { icon: Zap, label: 'Speed', value: '< 2 Minutes', color: 'from-green-500 to-green-600' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02, y: -4 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Left Column - Scanner */}
            <motion.div
              variants={itemVariants}
              className="xl:col-span-4"
            >
              <NicheScanner onNicheAnalyzed={handleNicheAnalyzed} />
            </motion.div>

            {/* Right Column - Results and Heatmap */}
            <motion.div
              variants={itemVariants}
              className="xl:col-span-8 space-y-8"
            >
              <DemandHeatmap nicheData={currentNiche} />
              <NicheResults nicheData={currentNiche} />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}