export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  subscription?: SubscriptionPlan;
  reportsUsed: number;
  reportsLimit: number;
  createdAt: Date;
}

export interface SubscriptionPlan {
  type: 'free' | 'premium';
  status: 'active' | 'cancelled' | 'expired';
  startDate: Date;
  endDate?: Date;
  stripeCustomerId?: string;
  stripePriceId?: string;
}

export interface NicheData {
  id: string;
  topic: string;
  microNiches: MicroNiche[];
  searchVolume: number;
  competition: 'low' | 'medium' | 'high';
  monetizationPotential: number;
  timestamp: Date;
  userId: string;
}

export interface MicroNiche {
  name: string;
  description: string;
  searchVolume: number;
  competition: 'low' | 'medium' | 'high';
  monetizationScore: number;
  examples: string[];
  trends: TrendData[];
  validationScore: number;
}

export interface TrendData {
  date: string;
  searchVolume: number;
  engagement: number;
  mentions: number;
}

export interface ValidationReport {
  id: string;
  nicheId: string;
  userId: string;
  profitabilityScore: number;
  audienceSize: number;
  competitorAnalysis: CompetitorData[];
  contentGaps: string[];
  monetizationStrategies: string[];
  riskFactors: string[];
  timeToMarket: string;
  successRoadmap?: {
    phase1?: {
      timeline: string;
      objectives: string[];
      budget: string;
      keyActions: string[];
    };
    phase2?: {
      timeline: string;
      objectives: string[];
      budget: string;
      keyActions: string[];
    };
    phase3?: {
      timeline: string;
      objectives: string[];
      budget: string;
      keyActions: string[];
    };
  };
  generatedAt: Date;
}

export interface CompetitorData {
  name: string;
  followers: number;
  engagement: number;
  strengths: string[];
  weaknesses: string[];
}

export interface HeatmapData {
  niche: string;
  searchVolume: number;
  competition: number;
  monetization: number;
  x: number;
  y: number;
  value: number;
}