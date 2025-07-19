import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card } from '../ui/Card';
import { NicheData } from '../../types';
import { TrendingUp, Users, DollarSign, Zap } from 'lucide-react';

interface DemandHeatmapProps {
  nicheData: NicheData | null;
}

export function DemandHeatmap({ nicheData }: DemandHeatmapProps) {
  if (!nicheData) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Run a niche analysis to see the demand heatmap</p>
        </div>
      </Card>
    );
  }

  const heatmapData = nicheData.microNiches.map((niche, index) => ({
    name: niche.name.length > 20 ? niche.name.substring(0, 20) + '...' : niche.name,
    fullName: niche.name,
    searchVolume: niche.searchVolume,
    monetization: niche.monetizationScore,
    validation: niche.validationScore,
    competition: niche.competition === 'low' ? 30 : niche.competition === 'medium' ? 60 : 90,
  }));

  const getColor = (value: number) => {
    if (value >= 80) return '#10B981'; // Green
    if (value >= 60) return '#F59E0B'; // Yellow
    if (value >= 40) return '#EF4444'; // Red
    return '#6B7280'; // Gray
  };

  const stats = [
    {
      label: 'Total Search Volume',
      value: nicheData.searchVolume.toLocaleString(),
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Avg. Monetization',
      value: Math.round(nicheData.microNiches.reduce((acc, niche) => acc + niche.monetizationScore, 0) / nicheData.microNiches.length) + '%',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Competition Level',
      value: nicheData.competition.charAt(0).toUpperCase() + nicheData.competition.slice(1),
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      label: 'Opportunity Score',
      value: nicheData.monetizationPotential + '/100',
      icon: Zap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center mr-3`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Heatmap Chart */}
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Micro-Niche Analysis</h3>
          <p className="text-gray-600">Monetization potential vs validation score for each micro-niche</p>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={heatmapData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                        <p className="font-semibold text-gray-900">{data.fullName}</p>
                        <p className="text-sm text-gray-600">Search Volume: {data.searchVolume.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Monetization: {data.monetization}%</p>
                        <p className="text-sm text-gray-600">Validation: {data.validation}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="monetization" radius={[4, 4, 0, 0]}>
                {heatmapData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.monetization)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span>High Potential (80%+)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
            <span>Medium Potential (60-79%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
            <span>Low Potential (40-59%)</span>
          </div>
        </div>
      </Card>
    </div>
  );
}