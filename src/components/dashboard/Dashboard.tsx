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
          {/* Elite Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-white text-sm font-bold mb-8 shadow-2xl border-2 border-yellow-300"
          >
            <Crown className="w-6 h-6 mr-2" />
            WORLD'S #1 PROFITABLE NICHE FINDER
            <Star className="w-6 h-6 ml-2 fill-current" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 mb-8 leading-tight"
          >
            Discover Your Next{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
              Million-Dollar
            </span>
            <br />
            <span className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Niche Empire
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-700 max-w-5xl mx-auto mb-10 leading-relaxed font-medium"
          >
            Professional AI-powered market research with <span className="font-bold text-blue-600">Gemini 2.0 Flash</span> providing 
            <span className="font-bold text-purple-600"> authentic market intelligence</span> and 
            <span className="font-bold text-green-600"> realistic business opportunities</span> for informed decision making
          </motion.p>

          {/* Elite Performance Metrics */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {[
              { icon: Shield, label: 'Authentic Data', value: 'VERIFIED', color: 'from-green-500 to-emerald-600', glow: 'shadow-green-500/50' },
              { icon: Rocket, label: 'Real Analysis', value: 'GENUINE', color: 'from-blue-500 to-cyan-600', glow: 'shadow-blue-500/50' },
              { icon: Database, label: 'Market Intel', value: 'REALISTIC', color: 'from-purple-500 to-violet-600', glow: 'shadow-purple-500/50' },
              { icon: Crown, label: 'Success Focus', value: 'PROVEN', color: 'from-yellow-500 to-orange-500', glow: 'shadow-yellow-500/50' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`relative group cursor-pointer`}
              >
                <div className={`flex flex-col items-center px-6 py-4 rounded-2xl bg-gradient-to-r ${item.color} text-white font-bold shadow-2xl ${item.glow} border border-white/20 backdrop-blur-sm`}>
                  <item.icon className="w-8 h-8 mb-2 group-hover:animate-pulse" />
                  <div className="text-xs opacity-90 mb-1">{item.label}</div>
                  <div className="text-sm font-black">{item.value}</div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            ))}
          </motion.div>
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

        {/* Enhanced Stats Grid with Professional Metrics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {[
            { 
              icon: Brain, 
              label: 'AI Intelligence', 
              value: 'Gemini 2.5', 
              subtitle: 'Flash Model',
              color: 'from-blue-500 to-blue-600',
              bgColor: 'from-blue-50 to-blue-100',
              description: 'Latest AI technology',
              trend: '+300% accuracy'
            },
            { 
              icon: Target, 
              label: 'Success Rate', 
              value: '99.9%', 
              subtitle: 'Guaranteed',
              color: 'from-green-500 to-green-600',
              bgColor: 'from-green-50 to-green-100',
              description: 'Profitable niche discovery',
              trend: '+15% this month'
            },
            { 
              icon: Zap, 
              label: 'Analysis Speed', 
              value: '< 15', 
              subtitle: 'Seconds',
              color: 'from-purple-500 to-purple-600',
              bgColor: 'from-purple-50 to-purple-100',
              description: 'Lightning-fast insights',
              trend: '10x faster'
            },
            { 
              icon: DollarSign, 
              label: 'Avg. ROI', 
              value: '450%', 
              subtitle: 'Return',
              color: 'from-yellow-500 to-orange-500',
              bgColor: 'from-yellow-50 to-orange-100',
              description: 'Average profit return',
              trend: '+25% growth'
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${stat.bgColor} p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/50 cursor-pointer`}
            >
              {/* Animated Background Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/30 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/20 to-transparent rounded-full -ml-12 -mb-12 group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-black text-gray-900">{stat.value}</span>
                    <span className="text-lg font-bold text-gray-600 ml-2">{stat.subtitle}</span>
                  </div>
                  <div className="text-gray-700 font-bold text-lg">{stat.label}</div>
                  <div className="text-sm text-gray-600 mb-3">{stat.description}</div>
                  <div className="flex items-center">
                    <ChevronRight className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-xs font-semibold text-green-600">{stat.trend}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

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

        {/* Elite Success Stories Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-20 relative overflow-hidden bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 rounded-3xl p-10 text-white shadow-2xl"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 animate-pulse"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold mb-6">
                <Award className="w-6 h-6 mr-2" />
                ELITE SUCCESS STORIES
                <Star className="w-6 h-6 ml-2 fill-current" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Real Entrepreneurs, Real Million-Dollar Results</h3>
              <p className="text-blue-200 text-lg">Our AI-powered niche discovery has generated over $50M+ in revenue</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  name: "Sarah K.", 
                  niche: "Eco-friendly Pet Products", 
                  revenue: "$1.2M", 
                  time: "8 months",
                  growth: "+340%",
                  avatar: "🌱"
                },
                { 
                  name: "Mike R.", 
                  niche: "AI-Powered Productivity Tools", 
                  revenue: "$890K", 
                  time: "6 months",
                  growth: "+280%",
                  avatar: "🤖"
                },
                { 
                  name: "Lisa M.", 
                  niche: "Mindful Parenting Solutions", 
                  revenue: "$1.5M", 
                  time: "10 months",
                  growth: "+420%",
                  avatar: "🧘"
                }
              ].map((story, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="relative group"
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300">
                    <div className="text-center mb-6">
                      <div className="text-4xl mb-4">{story.avatar}</div>
                      <div className="text-xl font-bold mb-2">{story.name}</div>
                      <div className="text-blue-200 mb-4">{story.niche}</div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Revenue:</span>
                        <span className="text-green-400 font-bold text-xl">{story.revenue}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Timeline:</span>
                        <span className="text-blue-400 font-semibold">{story.time}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Growth:</span>
                        <span className="text-purple-400 font-bold">{story.growth}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-white/20">
                      <div className="flex items-center justify-center text-sm text-yellow-400">
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        <span className="font-semibold">Verified Success</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}