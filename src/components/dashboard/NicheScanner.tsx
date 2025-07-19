import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, TrendingUp, Zap, Brain } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { NicheService } from '../../services/nicheService';
import { useAuth } from '../../contexts/AuthContext';
import { NicheData } from '../../types';
import toast from 'react-hot-toast';

interface NicheScannerProps {
  onNicheAnalyzed: (niche: NicheData) => void;
}

export function NicheScanner({ onNicheAnalyzed }: NicheScannerProps) {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser, canGenerateReport, incrementReportUsage } = useAuth();

  const handleAnalyze = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic to analyze');
      return;
    }

    if (!currentUser) {
      toast.error('Please sign in to analyze niches');
      return;
    }

    if (!canGenerateReport()) {
      toast.error('You have reached your report limit. Upgrade to premium for unlimited reports.');
      return;
    }

    setLoading(true);
    try {
      const nicheData = await NicheService.analyzeNiche(topic, currentUser.uid);
      await incrementReportUsage();
      onNicheAnalyzed(nicheData);
      toast.success('Niche analysis completed!');
      setTopic('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to analyze niche');
    } finally {
      setLoading(false);
    }
  };

  const exampleTopics = [
    { text: 'eco-friendly pets', icon: '🌱' },
    { text: 'home office wellness', icon: '🏠' },
    { text: 'digital nomad tools', icon: '💻' },
    { text: 'sustainable fashion', icon: '👕' },
    { text: 'mental health tech', icon: '🧠' }
  ];

  return (
    <Card variant="glass" padding="lg" className="h-fit sticky top-24">
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            delay: 0.2 
          }}
          className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"
        >
          <Brain className="w-10 h-10 text-white" />
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-gray-900 mb-3"
        >
          AI Niche Scanner
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 leading-relaxed"
        >
          Discover untapped micro-niches with AI-powered market analysis
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-6"
      >
        <Input
          label="Enter Broad Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., sustainable living, fitness tech, creative tools..."
          icon={<Search className="w-5 h-5" />}
          onKeyPress={(e) => e.key === 'Enter' && !loading && handleAnalyze()}
          inputSize="lg"
          helperText="Be specific for better results"
        />

        <Button
          onClick={handleAnalyze}
          loading={loading}
          fullWidth
          size="lg"
          leftIcon={<TrendingUp className="w-5 h-5" />}
          className="font-bold"
        >
          {loading ? 'Analyzing Market...' : 'Analyze Micro-Niches'}
        </Button>

        {currentUser && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200"
          >
            <div className="flex items-center justify-center mb-2">
              <Zap className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm font-semibold text-blue-800">Usage Status</span>
            </div>
            <div className="text-sm text-blue-700">
              Reports used: <span className="font-bold">{currentUser.reportsUsed}</span> / {' '}
              <span className="font-bold">
                {currentUser.subscription?.type === 'premium' ? '∞' : currentUser.reportsLimit}
              </span>
            </div>
            {currentUser.subscription?.type === 'free' && (
              <div className="mt-2">
                <a 
                  href="/subscription" 
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium underline"
                >
                  Upgrade for unlimited reports
                </a>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Example Topics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-8"
      >
        <p className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
          <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
          Try these examples:
        </p>
        <div className="grid grid-cols-1 gap-3">
          {exampleTopics.map((example, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setTopic(example.text)}
              disabled={loading}
              className="flex items-center p-3 text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-lg mr-3">{example.icon}</span>
              <span className="font-medium">{example.text}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* AI Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200"
      >
        <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
          <Brain className="w-4 h-4 mr-2 text-purple-600" />
          AI Analysis Includes:
        </h4>
        <ul className="space-y-2 text-xs text-gray-600">
          <li className="flex items-center">
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></div>
            Real-time market demand analysis
          </li>
          <li className="flex items-center">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
            Competition level assessment
          </li>
          <li className="flex items-center">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
            Monetization potential scoring
          </li>
          <li className="flex items-center">
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></div>
            Trend validation & forecasting
          </li>
        </ul>
      </motion.div>
    </Card>
  );
}