import React from 'react';
import { motion } from 'framer-motion';
import { Brain, BarChart3, FileText, Zap, Target, TrendingUp } from 'lucide-react';
import { Card } from '../ui/Card';

export function Features() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze millions of data points from Reddit, Twitter, and e-commerce platforms.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: BarChart3,
      title: 'Demand Heatmap',
      description: 'Interactive visualizations showing search volume, competition levels, and monetization potential.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: FileText,
      title: 'Instant Reports',
      description: 'Comprehensive validation reports with profitability analysis and competitor insights in seconds.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Target,
      title: 'Micro-Niche Focus',
      description: 'Discover specific, actionable niches with lower competition and higher profit margins.',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: TrendingUp,
      title: 'Trend Tracking',
      description: 'Real-time monitoring of emerging trends and market shifts in your chosen niches.',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: Zap,
      title: 'Fast Results',
      description: 'Get actionable insights in minutes instead of spending months on manual research.',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Smart Entrepreneurs
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to discover, validate, and dominate profitable micro-niches
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <Card hover className="p-6 h-full">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}