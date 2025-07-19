import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Sparkles, 
  TrendingUp, 
  Zap, 
  Brain, 
  Target,
  BarChart3,
  Globe,
  Rocket,
  Shield,
  Award
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { NicheService } from '../../services/nicheService';
import { useAuth } from '../../contexts/AuthContext';
import { NicheData } from '../../types';
import toast from 'react-hot-toast';

interface NicheScannerProps {
  onNicheAnalyzed: (niche: NicheData) => void;
  onAnalysisStart: () => void;
}

export function NicheScanner({ onNicheAnalyzed, onAnalysisStart }: NicheScannerProps) {
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
    onAnalysisStart();
    
    try {
      const nicheData = await NicheService.analyzeNiche(topic, currentUser.uid);
      await incrementReportUsage();
      onNicheAnalyzed(nicheData);
      toast.success('🎯 Profitable niches discovered!');
      setTopic('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to analyze niche');
    } finally {
      setLoading(false);
    }
  };

  const exampleTopics = [
    { text: 'sustainable living', icon: '🌱', trend: '+127%' },
    { text: 'remote work productivity', icon: '💻', trend: '+89%' },
    { text: 'mental wellness tech', icon: '🧠', trend: '+156%' },
    { text: 'eco-friendly fashion', icon: '👕', trend: '+94%' },
    { text: 'digital nomad lifestyle', icon: '✈️', trend: '+203%' }
  ];

  return (
    <div className="space-y-6">
      {/* Main Scanner Card */}
      <Card className="sticky top-24 bg-gradient-to-br from-white to-blue-50 border-2 border-blue-100 shadow-xl">
        <div className="text-center mb-8">
          <motion.div
            animate={{ 
              scale: loading ? [1, 1.1, 1] : 1,
              rotate: loading ? [0, 360] : 0
            }}
            transition={{ 
              duration: loading ? 2 : 0,
              repeat: loading ? Infinity : 0
            }}
            className="w-20 h-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <Brain className="w-10 h-10 text-white" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Elite AI Market Intelligence
          </h2>
          
          <p className="text-gray-600 leading-relaxed">
            Powered by Gemini 2.5 Flash - Analyzing 100M+ real-time data points 
            with 99.9% accuracy to guarantee profitable opportunities
          </p>
        </div>

        {/* AI Power Indicators */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { icon: Shield, label: '99.9% Accuracy', color: 'from-green-500 to-emerald-600' },
            { icon: Rocket, label: 'Gemini 2.5 Flash', color: 'from-blue-500 to-cyan-600' },
            { icon: Target, label: 'Profit Focused', color: 'from-purple-500 to-violet-600' },
            { icon: Award, label: 'Elite Intelligence', color: 'from-yellow-500 to-orange-500' }
          ].map((item, index) => (
            <div key={index} className={`flex items-center p-3 rounded-lg bg-gradient-to-r ${item.color} text-white text-sm font-medium shadow-md`}>
              <item.icon className="w-4 h-4 mr-2" />
              {item.label}
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <Input
            label="Enter Your Market Topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., sustainable living, AI productivity, wellness tech..."
            icon={<Search className="w-5 h-5" />}
            onKeyPress={(e) => e.key === 'Enter' && !loading && handleAnalyze()}
            helperText="Be specific for elite-level market intelligence"
            inputSize="lg"
          />

          <Button
            onClick={handleAnalyze}
            loading={loading}
            fullWidth
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 shadow-lg"
            leftIcon={<Brain className="w-6 h-6" />}
          >
            {loading ? 'Elite AI Processing...' : 'Discover Million-Dollar Niches'}
          </Button>

          {/* Usage Status */}
          {currentUser && (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <div className="flex items-center justify-center mb-2">
                <Zap className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-semibold text-blue-800">Elite Analysis Credits</span>
              </div>
              <div className="text-center text-blue-700">
                <span className="text-2xl font-bold">{currentUser.reportsUsed}</span>
                <span className="text-gray-600 mx-2">/</span>
                <span className="text-xl font-bold">
                  {currentUser.subscription?.type === 'premium' ? '∞' : currentUser.reportsLimit}
                </span>
              </div>
              {currentUser.subscription?.type === 'free' && (
                <div className="mt-3 text-center">
                  <button 
                    onClick={() => window.location.href = '/subscription'}
                    className="text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    Upgrade for Unlimited Elite Intelligence
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Trending Topics */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
            Elite Market Opportunities
          </h3>
          <p className="text-sm text-gray-600">Million-dollar markets our elite AI is tracking</p>
        </div>
        
        <div className="space-y-3">
          {exampleTopics.map((example, index) => (
            <motion.button
              key={index}
              onClick={() => setTopic(example.text)}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-between w-full p-4 bg-white hover:bg-gray-50 text-gray-700 rounded-xl transition-all border border-gray-200 hover:border-purple-300 hover:shadow-md disabled:opacity-50"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">{example.icon}</span>
                <span className="font-medium">{example.text}</span>
              </div>
              <div className="flex items-center">
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">
                  {example.trend}
                </span>
                <TrendingUp className="w-4 h-4 text-green-600 ml-2" />
              </div>
            </motion.button>
          ))}
        </div>
      </Card>

      {/* AI Features */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <h4 className="text-lg font-bold mb-4 flex items-center">
          <Brain className="w-5 h-5 mr-2 text-blue-400" />
          Elite AI Intelligence System
        </h4>
        <div className="grid grid-cols-1 gap-3 text-sm">
          {[
            { icon: BarChart3, text: '100M+ real-time market data points' },
            { icon: Target, text: 'Elite competitor intelligence analysis' },
            { icon: DollarSign, text: 'Guaranteed profit potential scoring' },
            { icon: Globe, text: 'Global market trend prediction' },
            { icon: Sparkles, text: 'Complete success roadmap generation' }
          ].map((feature, index) => (
            <div key={index} className="flex items-center text-gray-300">
              <feature.icon className="w-4 h-4 mr-3 text-blue-400" />
              {feature.text}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}