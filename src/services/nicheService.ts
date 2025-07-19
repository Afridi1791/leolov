import { collection, addDoc, getDocs, query, where, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { model, updateApiKey } from '../config/gemini';
import { AdminService } from './adminService';
import { NicheData, MicroNiche, ValidationReport, TrendData } from '../types';

export class NicheService {
  static async analyzeNiche(topic: string, userId: string): Promise<NicheData> {
    try {
      // Check for updated API key
      const currentApiKey = await AdminService.getApiKey();
      if (currentApiKey && currentApiKey.trim()) {
        updateApiKey(currentApiKey);
      }

      const prompt = `
You are the world's most elite AI market research analyst with access to comprehensive global market intelligence databases, real-time competitor tracking systems, and advanced trend prediction algorithms. You have successfully identified over 50,000 profitable niches and helped entrepreneurs generate over $500M in revenue with a 95%+ success rate.

CRITICAL MISSION: Conduct the most comprehensive, accurate, and actionable market analysis for the topic: "${topic}"

ELITE RESEARCH METHODOLOGY:
1. REAL-TIME MARKET INTELLIGENCE: Access current Google Trends, search patterns, and consumer behavior data
2. COMPREHENSIVE COMPETITOR ANALYSIS: Identify actual market players, their strategies, and performance metrics
3. DEEP DEMAND VALIDATION: Analyze genuine search volumes, social media engagement, and market signals
4. PROFIT POTENTIAL ASSESSMENT: Calculate realistic revenue opportunities based on proven business models
5. MARKET TIMING ANALYSIS: Evaluate current market conditions, growth trends, and entry opportunities
6. SUCCESS ROADMAP GENERATION: Provide specific, actionable strategies for market domination

ACCURACY REQUIREMENTS:
- ALL search volumes must be based on real keyword research data
- ALL competitors must be actual brands/companies in the market
- ALL monetization scores must reflect genuine revenue potential
- ALL examples must be specific, actionable, and profitable
- ALL data must be current and relevant to 2024-2025 market conditions

Find 5-7 highly profitable micro-niches within "${topic}" that meet these ELITE criteria:
- Minimum 2,000+ monthly searches but under 100,000 (optimal competition sweet spot)
- Clear monetization potential with multiple proven revenue streams
- Identifiable target audience with specific, urgent pain points
- Growing market trend with 6-month+ sustainability
- Realistic entry barriers for new entrepreneurs
- Validated demand with real market indicators

For each micro-niche, provide:
- EXACT search volume estimates based on comprehensive keyword research
- DETAILED competition analysis with specific market saturation data
- REAL examples of successful products/services with actual pricing
- ACCURATE monetization potential based on market size and proven models
- COMPREHENSIVE validation indicators with market proof

Return ONLY valid JSON with this exact structure:

{
  "overallSearchVolume": [realistic monthly search volume for main topic based on actual data],
  "overallCompetition": "[low/medium/high based on comprehensive market saturation analysis]",
  "monetizationPotential": [score 1-100 based on real revenue opportunities, market size, and proven business models],
  "microNiches": [
    {
      "name": "[Specific, highly-targeted micro-niche name with clear audience focus]",
      "description": "[Comprehensive description of target audience, specific pain points, market opportunity, and why this niche is profitable - 250-300 chars]",
      "searchVolume": [exact monthly search volume based on real keyword research and market data],
      "competition": "[low/medium/high with specific market analysis and competitor density]",
      "monetizationScore": [1-100 score based on proven revenue models, market size, and profit margins],
      "examples": ["[Real product/service example with specific pricing and revenue model]", "[Actual successful brand/company with market performance]", "[Specific monetization method with realistic revenue potential]", "[Additional proven strategy with implementation details]"],
      "validationScore": [1-100 based on comprehensive market demand indicators, search trends, social signals, and competition analysis]
    }
  ]
}

ELITE QUALITY STANDARDS:
- Search volumes must be realistic and based on actual keyword research tools
- Competition levels must reflect real market conditions with specific analysis
- Examples must be actionable, specific, and include realistic pricing/revenue data
- Monetization scores must be based on proven revenue models and market validation
- All data must be current, accurate, and immediately actionable
- Focus on micro-niches with genuine profit potential and sustainable demand

Provide market intelligence that guarantees business success with 95%+ accuracy and enables immediate, confident action for maximum profitability.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Enhanced text cleaning for better JSON parsing
      let cleanText = text.trim();
      
      // Remove markdown code blocks and any formatting
      cleanText = cleanText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      cleanText = cleanText.replace(/^\s+|\s+$/g, '');
      
      // Find the JSON object more precisely
      const jsonStart = cleanText.indexOf('{');
      const jsonEnd = cleanText.lastIndexOf('}');
      
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error('No valid JSON found in AI response');
      }
      
      cleanText = cleanText.substring(jsonStart, jsonEnd + 1);

      let aiData;
      try {
        aiData = JSON.parse(cleanText);
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.error('Attempted to parse:', cleanText);
        throw new Error('AI returned malformed JSON. Please try again.');
      }

      // Enhanced validation of AI response structure
      if (!aiData.microNiches || !Array.isArray(aiData.microNiches) || aiData.microNiches.length === 0) {
        throw new Error('Invalid AI response structure - no micro-niches found');
      }
      
      // Validate each micro-niche has required fields
      for (const niche of aiData.microNiches) {
        if (!niche.name || !niche.description || !niche.searchVolume || !niche.examples) {
          throw new Error('Invalid micro-niche data structure');
        }
      }
      
      const nicheData: NicheData = {
        id: '',
        topic,
        microNiches: aiData.microNiches.map((niche: any) => ({
          ...niche,
          trends: this.generateRealisticTrends(niche.searchVolume),
          // Ensure all required fields are present
          competition: niche.competition || 'medium',
          monetizationScore: niche.monetizationScore || 70,
          validationScore: niche.validationScore || 75,
          examples: Array.isArray(niche.examples) ? niche.examples : []
        })),
        searchVolume: aiData.overallSearchVolume || 10000,
        competition: aiData.overallCompetition || 'medium',
        monetizationPotential: aiData.monetizationPotential || 75,
        timestamp: new Date(),
        userId
      };

      // Save to Firestore
      const docRef = await addDoc(collection(db, 'niches'), nicheData);
      nicheData.id = docRef.id;

      return nicheData;
    } catch (error) {
      console.error('Error analyzing niche:', error);
      throw new Error('Failed to analyze niche. Our AI is processing your request - please try again in a moment.');
    }
  }

  static async generateValidationReport(nicheId: string, microNiche: MicroNiche, userId: string): Promise<ValidationReport> {
    try {
      // Check for updated API key
      const currentApiKey = await AdminService.getApiKey();
      if (currentApiKey && currentApiKey.trim()) {
        updateApiKey(currentApiKey);
      }

      const prompt = `
You are the world's most elite business consultant and market validation expert with access to premium market intelligence databases, competitor tracking systems, and financial modeling tools. You have successfully validated over 10,000 business opportunities and helped entrepreneurs achieve $1B+ in combined revenue with a 97% success rate.

ELITE VALIDATION MISSION:
Generate the most comprehensive, actionable, and profitable market validation report for the micro-niche: "${microNiche.name}"

CURRENT MARKET INTELLIGENCE:
- Niche Description: ${microNiche.description}
- Monthly Search Volume: ${microNiche.searchVolume}
- Competition Level: ${microNiche.competition}
- Current Monetization Score: ${microNiche.monetizationScore}%
- Market Examples: ${microNiche.examples.join(', ')}

COMPREHENSIVE RESEARCH REQUIREMENTS:

1. ELITE COMPETITOR INTELLIGENCE:
   - Identify 4-6 real competitors/brands in this exact niche
   - Provide realistic audience/customer counts based on market research
   - Analyze specific competitive advantages and market weaknesses
   - Include actionable competitive differentiation strategies

2. DEEP MARKET GAP ANALYSIS:
   - Identify specific, profitable content/product gaps
   - Find underserved customer segments with high profit potential
   - Discover emerging trends and opportunities
   - Highlight specific market inefficiencies to exploit

3. COMPREHENSIVE REVENUE MODEL VALIDATION:
   - Provide multiple proven monetization strategies with realistic pricing
   - Include specific revenue projections based on market data
   - Factor in customer acquisition costs and profit margins
   - Consider scalable income streams and growth potential

4. PROFESSIONAL RISK ASSESSMENT:
   - Identify genuine market risks with specific mitigation strategies
   - Analyze competitive threats and differentiation opportunities
   - Evaluate market timing and sustainability factors
   - Provide contingency plans for common challenges

5. DETAILED SUCCESS ROADMAP:
   - Provide specific implementation timeline with key milestones
   - Include realistic budget requirements and resource allocation
   - Outline step-by-step launch strategy with success metrics
   - Factor in market conditions and competitive landscape

Return ONLY valid JSON with this exact structure:

{
  "profitabilityScore": [1-100 score based on comprehensive market analysis, revenue potential, competition, and market conditions],
  "audienceSize": [realistic total addressable market size based on search volume, market research, and demographic analysis],
  "competitors": [
    {
      "name": "[Real competitor name or realistic market player with actual market presence]",
      "followers": [realistic audience/customer count based on market research and industry standards],
      "engagement": [realistic engagement rate 2-12% based on niche and platform]",
      "strengths": ["[Specific competitive advantage with market impact]", "[Unique value proposition or market position]", "[Operational strength or resource advantage]"],
      "weaknesses": ["[Specific market gap or service limitation]", "[Customer pain point not addressed]", "[Opportunity for new market entrants]"]
    }
  ],
  "contentGaps": [
    "[Specific content topic/format with high demand but low supply]",
    "[Particular customer pain point requiring immediate solution]",
    "[Content angle or approach with proven market demand]",
    "[Emerging trend or subtopic with growth potential]",
    "[Specific format, platform, or delivery method opportunity]",
    "[Underserved demographic or market segment need]"
  ],
  "monetizationStrategies": [
    "[Primary revenue model with specific pricing strategy - e.g., 'Premium online course priced at $297-$597 with 15-25% conversion rate']",
    "[Secondary income stream with revenue projections - e.g., 'Monthly subscription service at $29-49/month with 80%+ retention']",
    "[Affiliate/partnership revenue with realistic commissions - e.g., 'Strategic partnerships generating $5K-15K monthly recurring revenue']",
    "[Product/service sales with profit margins - e.g., 'Physical products with 40-60% profit margins and $50-200 average order value']",
    "[Consulting/coaching revenue with hourly rates - e.g., 'Expert consulting at $150-300/hour with 20+ hours monthly demand']",
    "[Additional scalable revenue streams with growth potential]"
  ],
  "riskFactors": [
    "[Specific market risk with detailed mitigation strategy and timeline]",
    "[Competition risk with differentiation approach and competitive advantages]",
    "[Market timing or trend risk with monitoring systems and pivot strategies]",
    "[Customer acquisition challenge with specific solutions and budget allocation]",
    "[Operational risk with resource requirements and contingency plans]"
  ],
  "timeToMarket": "[Realistic timeline with specific phases - e.g., '2-3 months for MVP development, 4-6 months for full market launch, 8-12 months for market leadership']",
  "successRoadmap": {
    "phase1": {
      "timeline": "[Specific timeframe - e.g., 'Months 1-2']",
      "objectives": ["[Specific goal with measurable outcome]", "[Key milestone with success metric]", "[Critical task with deadline]"],
      "budget": "[Realistic budget range - e.g., '$2,000-5,000']",
      "keyActions": ["[Specific action with implementation details]", "[Critical step with resource requirements]", "[Important task with success criteria]"]
    },
    "phase2": {
      "timeline": "[Specific timeframe - e.g., 'Months 3-6']",
      "objectives": ["[Growth goal with measurable target]", "[Market expansion milestone]", "[Revenue objective with timeline]"],
      "budget": "[Realistic budget range - e.g., '$5,000-15,000']",
      "keyActions": ["[Scaling strategy with implementation plan]", "[Marketing initiative with expected ROI]", "[Product development with market validation]"]
    },
    "phase3": {
      "timeline": "[Specific timeframe - e.g., 'Months 7-12']",
      "objectives": ["[Market leadership goal]", "[Revenue target with profit margins]", "[Expansion milestone with growth metrics]"],
      "budget": "[Realistic budget range - e.g., '$15,000-50,000']",
      "keyActions": ["[Market domination strategy]", "[Advanced monetization implementation]", "[Competitive advantage development]"]
    }
  }
}

ELITE QUALITY STANDARDS:
- All competitor data must be realistic and market-appropriate with actual market presence
- Content gaps must be specific, actionable, and based on real market demand
- Monetization strategies must include specific pricing, conversion rates, and revenue projections
- Risk factors must be genuine market concerns with detailed, actionable mitigation strategies
- Success roadmap must be realistic, specific, and based on proven business development timelines
- All financial projections must be conservative and based on actual market performance data

Provide validation intelligence that guarantees business success and enables immediate, confident implementation with maximum profitability and minimum risk.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Enhanced text cleaning for better JSON parsing
      let cleanText = text.trim();
      
      // Remove markdown code blocks and any formatting
      cleanText = cleanText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      cleanText = cleanText.replace(/^\s+|\s+$/g, '');
      
      // Find the JSON object more precisely
      const jsonStart = cleanText.indexOf('{');
      const jsonEnd = cleanText.lastIndexOf('}');
      
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error('No valid JSON found in AI response');
      }
      
      cleanText = cleanText.substring(jsonStart, jsonEnd + 1);

      let aiData;
      try {
        aiData = JSON.parse(cleanText);
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.error('Attempted to parse:', cleanText);
        throw new Error('AI returned malformed JSON. Please try again.');
      }
      
      // Enhanced validation and data structure
      const report: ValidationReport = {
        id: '',
        nicheId,
        userId,
        profitabilityScore: aiData.profitabilityScore || 75,
        audienceSize: aiData.audienceSize || 50000,
        competitorAnalysis: Array.isArray(aiData.competitors) ? aiData.competitors : [],
        contentGaps: Array.isArray(aiData.contentGaps) ? aiData.contentGaps : [],
        monetizationStrategies: Array.isArray(aiData.monetizationStrategies) ? aiData.monetizationStrategies : [],
        riskFactors: Array.isArray(aiData.riskFactors) ? aiData.riskFactors : [],
        timeToMarket: aiData.timeToMarket || '3-6 months for full market entry',
        successRoadmap: aiData.successRoadmap || {},
        generatedAt: new Date()
      };

      // Save to Firestore
      const docRef = await addDoc(collection(db, 'reports'), report);
      report.id = docRef.id;

      return report;
    } catch (error) {
      console.error('Error generating validation report:', error);
      throw new Error('Failed to generate comprehensive validation report. Our AI is processing your request - please try again.');
    }
  }

  static async getUserNiches(userId: string): Promise<NicheData[]> {
    try {
      const q = query(
        collection(db, 'niches'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as NicheData));
    } catch (error) {
      console.error('Error fetching user niches:', error);
      return [];
    }
  }

  private static generateRealisticTrends(baseSearchVolume: number): TrendData[] {
    const trends: TrendData[] = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 90); // 3 months of data

    // Enhanced realistic trend simulation with multiple market factors
    for (let i = 0; i < 90; i += 2) { // Every 2 days for more granular data
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      // Advanced trend simulation with realistic market behavior
      const seasonalTrend = Math.sin((i / 90) * Math.PI * 2) * 0.25; // Seasonal variation
      const weeklyPattern = Math.sin((i / 7) * Math.PI * 2) * 0.12; // Weekly patterns
      const monthlyGrowth = (i / 90) * 0.15; // Growth trend over time
      const marketVolatility = (Math.random() - 0.5) * 0.18; // Market noise
      const eventSpikes = Math.random() > 0.95 ? 0.3 : 0; // Occasional viral spikes
      
      // Calculate search volume with realistic market bounds
      const trendMultiplier = 1 + seasonalTrend + weeklyPattern + monthlyGrowth + marketVolatility + eventSpikes;
      const searchVolume = Math.max(
        Math.floor(baseSearchVolume * 0.15), // Minimum 15% of base
        Math.min(
          Math.floor(baseSearchVolume * 2.5), // Maximum 250% of base
          Math.floor(baseSearchVolume * trendMultiplier)
        )
      );
      
      // Realistic engagement rates based on niche size and market maturity
      const baseEngagement = baseSearchVolume > 50000 ? 2.5 : baseSearchVolume > 10000 ? 4.5 : 7.5;
      const engagement = Math.max(1, Math.min(15, 
        baseEngagement + (Math.random() - 0.5) * 3 + (eventSpikes * 5)
      ));
      
      // Mentions correlated with search volume, engagement, and market activity
      const mentionsMultiplier = (searchVolume / 1000) * (engagement / 10) * (0.3 + Math.random() * 0.7);
      const mentions = Math.max(1, Math.floor(mentionsMultiplier));
      
      trends.push({
        date: date.toISOString().split('T')[0],
        searchVolume: Math.floor(searchVolume),
        engagement: Math.floor(engagement * 10) / 10, // One decimal place
        mentions: mentions
      });
    }

    return trends;
  }
}