import React, { useState } from 'react';
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
    <Card className="sticky top-24">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-white" />
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          AI Niche Scanner
        </h2>
        
        <p className="text-gray-600">
          Discover untapped micro-niches with AI-powered analysis
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Enter Broad Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., sustainable living, fitness tech..."
          icon={<Search className="w-4 h-4" />}
          onKeyPress={(e) => e.key === 'Enter' && !loading && handleAnalyze()}
          helperText="Be specific for better results"
        />

        <Button
          onClick={handleAnalyze}
          loading={loading}
          fullWidth
          size="lg"
          leftIcon={<TrendingUp className="w-5 h-5" />}
        >
          {loading ? 'Analyzing Market...' : 'Analyze Micro-Niches'}
        </Button>

        {currentUser && (
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-center mb-1">
              <Zap className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-800">Usage Status</span>
            </div>
            <div className="text-sm text-blue-700">
              Reports used: <span className="font-bold">{currentUser.reportsUsed}</span> / {' '}
              <span className="font-bold">
                {currentUser.subscription?.type === 'premium' ? '∞' : currentUser.reportsLimit}
              </span>
            </div>
            {currentUser.subscription?.type === 'free' && (
              <div className="mt-2">
                <button 
                  onClick={() => window.location.href = '/subscription'}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium underline"
                >
                  Upgrade for unlimited reports
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Example Topics */}
      <div className="mt-6">
        <p className="text-sm font-medium text-gray-700 mb-3 flex items-center">
          <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
          Try these examples:
        </p>
        <div className="space-y-2">
          {exampleTopics.map((example, index) => (
            <button
              key={index}
              onClick={() => setTopic(example.text)}
              disabled={loading}
              className="flex items-center w-full p-2 text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors border border-gray-200 hover:border-gray-300 disabled:opacity-50"
            >
              <span className="text-base mr-3">{example.icon}</span>
              <span>{example.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* AI Features */}
      <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <h4 className="text-sm font-medium text-gray-800 mb-2 flex items-center">
          <Brain className="w-4 h-4 mr-2 text-purple-600" />
          AI Analysis Includes:
        </h4>
        <ul className="space-y-1 text-xs text-gray-600">
          <li>• Real-time market demand analysis</li>
          <li>• Competition level assessment</li>
          <li>• Monetization potential scoring</li>
          <li>• Trend validation & forecasting</li>
        </ul>
      </div>
    </Card>
  );
}