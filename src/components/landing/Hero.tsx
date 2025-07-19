import React from 'react';
import { ArrowRight, Sparkles, TrendingUp, Play, Star } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <div className="relative bg-gradient-to-br from-blue-50 to-white py-20 lg:py-32">
      <div className="container-responsive">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Niche Discovery
            <div className="ml-2 flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-current text-yellow-500" />
              ))}
            </div>
          </div>
          
          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Find Your Next{' '}
            <span className="text-gradient">Profitable Niche</span>{' '}
            in Minutes
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Stop spending months on manual research. Our AI analyzes millions of data points 
            to uncover untapped micro-niches with real profit potential.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button 
              onClick={onGetStarted} 
              size="lg" 
              className="px-8"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Start Discovering
            </Button>
            
            <Button 
              variant="secondary" 
              size="lg" 
              className="px-8"
              leftIcon={<Play className="w-5 h-5" />}
            >
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { number: '50K+', label: 'Niches Analyzed', icon: TrendingUp },
              { number: '98%', label: 'Accuracy Rate', icon: Star },
              { number: '5M+', label: 'Data Points', icon: Sparkles }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}