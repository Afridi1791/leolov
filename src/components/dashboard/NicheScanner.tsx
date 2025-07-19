import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, TrendingUp } from 'lucide-react';
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
    'eco-friendly pets',
    'home office wellness',
    'digital nomad tools',
    'sustainable fashion',
    'mental health tech'
  ];

  return (
    <Card className="p-6">
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Sparkles className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Niche Scanner</h2>
        <p className="text-gray-600">
          Discover untapped micro-niches with AI-powered market analysis
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Enter Broad Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., sustainable living, fitness tech, creative tools..."
          icon={<Search className="w-5 h-5 text-gray-400" />}
          onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
        />

        <Button
          onClick={handleAnalyze}
          loading={loading}
          className="w-full"
          size="lg"
        >
          <TrendingUp className="w-5 h-5 mr-2" />
          Analyze Micro-Niches
        </Button>

        {currentUser && (
          <div className="text-center text-sm text-gray-600">
            Reports used: {currentUser.reportsUsed} / {currentUser.reportsLimit}
            {currentUser.subscription?.type === 'free' && (
              <span className="ml-2 text-blue-600">
                (Upgrade for unlimited)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Example Topics */}
      <div className="mt-6">
        <p className="text-sm font-medium text-gray-700 mb-3">Try these examples:</p>
        <div className="flex flex-wrap gap-2">
          {exampleTopics.map((example, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTopic(example)}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              {example}
            </motion.button>
          ))}
        </div>
      </div>
    </Card>
  );
}