import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NicheScanner } from './NicheScanner';
import { DemandHeatmap } from './DemandHeatmap';
import { NicheResults } from './NicheResults';
import { NicheData } from '../../types';
import { 
  TrendingUp, 
  Zap, 
  Target, 
  Brain, 
  BarChart3, 
  DollarSign, 
  Users, 
  Globe,
  Sparkles,
  Award,
  Rocket,
  Shield,
  Crown,
  Star,
  ChevronRight,
  Activity,
  Database,
  Cpu,
  Eye
} from 'lucide-react';

export function Dashboard() {
  const [currentNiche, setCurrentNiche] = useState<NicheData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState('');

  const handleNicheAnalyzed = (niche: NicheData) => {
    setCurrentNiche(niche);
    setIsAnalyzing(false);
    setAnalysisStage('');
  };

  const handleAnalysisStart = () => {
    setIsAnalyzing(true);
    // Simulate analysis stages for better UX
    const stages = [
      'Initializing Gemini 2.5 Flash AI Engine...',
      'Scanning 100M+ global market data points...',
      'Analyzing competitor intelligence databases...',
      'Processing real-time trend signals...',
      'Calculating profit potential algorithms...',
      'Validating market opportunities...',
      'Generating success roadmaps...',
      'Finalizing comprehensive analysis...'
    ];
    
    let currentStageIndex = 0;
    setAnalysisStage(stages[0]);
    
    const stageInterval = setInterval(() => {
      currentStageIndex++;
      if (currentStageIndex < stages.length) {
        setAnalysisStage(stages[currentStageIndex]);
      } else {
        clearInterval(stageInterval);
      }
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="container-responsive py-8 relative z-10">
        {/* Premium Header with Enhanced Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight"
          >
            AI-Powered{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Niche Discovery
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-700 max-w-5xl mx-auto mb-10 leading-relaxed font-medium"
          >
            Professional AI-powered market research providing authentic market intelligence and realistic business opportunities for informed decision making
          </motion.p>
        </motion.div>

        {/* Enhanced AI Analysis Status with Professional Design */}
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12"
          >
            <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 rounded-3xl p-8 text-white shadow-2xl border border-blue-500/30">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mr-6"></div>
                    <div className="absolute inset-0 w-16 h-16 border-4 border-purple-400/30 border-b-purple-400 rounded-full animate-spin animate-reverse"></div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2 flex items-center">
                      <Cpu className="w-8 h-8 mr-3 text-blue-400 animate-pulse" />
                      Elite AI Market Intelligence Active
                    </h3>
                    <p className="text-blue-200 text-lg font-medium">{analysisStage}</p>
                  </div>
                </div>

                {/* Real-time Analysis Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Market Trends', status: 'Analyzing...', icon: TrendingUp, progress: 85 },
                    { label: 'Competitor Intel', status: 'Processing...', icon: Eye, progress: 72 },
                    { label: 'Profit Signals', status: 'Calculating...', icon: DollarSign, progress: 91 },
                    { label: 'Success Roadmap', status: 'Generating...', icon: Target, progress: 67 }
                  ].map((metric, index) => (
                    <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <div className="flex items-center mb-2">
                        <metric.icon className="w-5 h-5 text-blue-400 mr-2" />
                        <div className="text-sm font-semibold">{metric.label}</div>
                      </div>
                      <div className="text-xs text-blue-200 mb-2">{metric.status}</div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${metric.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Processing Indicators */}
                <div className="flex items-center justify-center space-x-8 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
                    <span>Gemini 2.5 Flash Active</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                    <span>100M+ Data Points</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse mr-2"></div>
                    <span>Real-time Intelligence</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content Grid with Enhanced Professional Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          {/* Left Column - Elite Scanner */}
          <div className="xl:col-span-4">
            <NicheScanner 
              onNicheAnalyzed={handleNicheAnalyzed} 
              onAnalysisStart={handleAnalysisStart}
            />
          </div>

          {/* Right Column - Professional Results and Analytics */}
          <div className="xl:col-span-8 space-y-10">
            <DemandHeatmap nicheData={currentNiche} />
            <NicheResults nicheData={currentNiche} />
          </div>
        </div>
      </div>
    </div>
  );
}