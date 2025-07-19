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
You are an elite market research analyst with access to real market data. Your task is to provide ONLY authentic, verifiable market intelligence based on actual companies, real search volumes, and genuine market conditions. NEVER create fictional data.

CRITICAL REQUIREMENTS FOR "${topic}":
1. Use ONLY real companies and brands that actually exist
2. Provide realistic search volumes based on actual keyword research patterns
3. Reference genuine market trends and data
4. Include only verified monetization strategies with real examples
5. Base all analysis on current market conditions (2024-2025)

RESEARCH METHODOLOGY:
1. Identify real companies operating in this market space
2. Analyze actual search volume patterns and trends
3. Reference genuine market opportunities and gaps
4. Provide realistic revenue projections based on market size
5. Include only proven, implementable strategies

AUTHENTICITY REQUIREMENTS:
- Search volumes must reflect realistic keyword research data (use tools like Google Keyword Planner ranges)
- Competitors must be real, verifiable companies you can name specifically
- Examples must be actual products/services with realistic pricing
- Monetization strategies must be proven and currently working in the market
- All data must be conservative and achievable

Find 4-6 realistic micro-niches within "${topic}" with these criteria:
- Search volume: 1,000-50,000 monthly (realistic range for micro-niches)
- Real market demand with actual companies serving this space
- Clear monetization potential with proven business models
- Specific target audience with genuine pain points
- Sustainable market opportunity (not just trends)

For each micro-niche, provide:
- Realistic search volume estimates (be conservative)
- Real competition analysis with actual company names
- Genuine examples of existing products/services with real pricing
- Conservative monetization scores based on actual market potential
- Honest validation based on real market indicators

Return ONLY valid JSON with this exact structure:

{
  "overallSearchVolume": [conservative monthly search volume estimate for main topic],
  "overallCompetition": "[low/medium/high based on actual market analysis]",
  "monetizationPotential": [realistic score 1-100 based on genuine market opportunities],
  "microNiches": [
    {
      "name": "[Specific micro-niche name]",
      "description": "[Clear description of the niche and target audience - 200-250 chars]",
      "searchVolume": [realistic monthly search volume based on keyword research patterns],
      "competition": "[low/medium/high based on actual market conditions]",
      "monetizationScore": [conservative score 1-100 based on real market potential],
      "examples": ["[Real product/service with actual pricing]", "[Existing company/brand in this space]", "[Proven monetization method]", "[Additional real strategy]"],
      "validationScore": [realistic score 1-100 based on genuine market indicators]
    }
  ]
}

QUALITY STANDARDS:
- All data must be realistic and conservative
- Examples must be real companies/products you can verify
- Search volumes should be achievable and based on actual patterns
- Competition analysis must reflect genuine market conditions
- Focus on sustainable, proven opportunities rather than get-rich-quick schemes

Provide honest, realistic market analysis that helps users make informed decisions based on actual market conditions.
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
        throw new Error('AI analysis incomplete - please try again with a more specific topic');
      }
      
      // Validate each micro-niche has required fields
      for (const niche of aiData.microNiches) {
        if (!niche.name || !niche.description || !niche.searchVolume || !niche.examples) {
          throw new Error('Incomplete market data received - please try again');
        }
        
        // Validate realistic data ranges
        if (niche.searchVolume > 100000 || niche.searchVolume < 100) {
          niche.searchVolume = Math.max(500, Math.min(50000, niche.searchVolume));
        }
        
        if (niche.monetizationScore > 100 || niche.monetizationScore < 1) {
          niche.monetizationScore = Math.max(30, Math.min(85, niche.monetizationScore));
        }
        
        if (niche.validationScore > 100 || niche.validationScore < 1) {
          niche.validationScore = Math.max(40, Math.min(90, niche.validationScore));
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
You are a professional market research analyst. Your task is to provide ONLY real, verifiable market validation data. Use actual company names, realistic metrics, and genuine market insights. NEVER create fictional data.

VALIDATION MISSION:
Generate an authentic market validation report for: "${microNiche.name}"

CURRENT MARKET INTELLIGENCE:
- Niche Description: ${microNiche.description}
- Monthly Search Volume: ${microNiche.searchVolume}
- Competition Level: ${microNiche.competition}
- Monetization Score: ${microNiche.monetizationScore}%
- Market Examples: ${microNiche.examples.join(', ')}

RESEARCH REQUIREMENTS - USE ONLY REAL DATA:

1. REAL COMPETITOR ANALYSIS:
   - Identify 2-3 actual companies/brands operating in this niche (MUST BE REAL AND VERIFIABLE)
   - Provide their official website URLs (must be working, real websites)
   - Include their verified social media profiles with full URLs (Instagram, Twitter, Facebook, LinkedIn, YouTube)
   - Provide realistic follower/customer estimates based on typical market sizes
   - Analyze genuine strengths and weaknesses of real competitors
   - Include practical differentiation opportunities

2. GENUINE MARKET GAPS:
   - Identify real content/product gaps in the market
   - Find underserved segments based on actual market research
   - Highlight realistic opportunities for new entrants
   - Focus on achievable market positions

3. REALISTIC REVENUE MODELS:
   - Provide proven monetization strategies with conservative pricing
   - Include realistic revenue projections based on market size
   - Factor in typical customer acquisition costs and margins
   - Focus on sustainable, scalable business models

4. HONEST RISK ASSESSMENT:
   - Identify real market risks and challenges
   - Provide practical mitigation strategies
   - Analyze genuine competitive threats
   - Include realistic timeline expectations

5. PRACTICAL SUCCESS ROADMAP:
   - Provide realistic implementation timeline
   - Include conservative budget estimates
   - Outline practical launch strategy
   - Set achievable milestones and metrics

Return ONLY valid JSON with this exact structure:

{
  "profitabilityScore": [conservative 1-100 score based on realistic market analysis],
  "audienceSize": [realistic market size estimate based on actual data patterns],
  "competitors": [
    {
      "name": "[Actual company/brand name that exists in this market]",
      "website": "[Real, working website URL - e.g., https://example.com]",
      "socialMedia": {
        "instagram": "[Real Instagram URL if exists - e.g., https://instagram.com/username]",
        "twitter": "[Real Twitter URL if exists - e.g., https://twitter.com/username]",
        "facebook": "[Real Facebook URL if exists - e.g., https://facebook.com/username]",
        "linkedin": "[Real LinkedIn URL if exists - e.g., https://linkedin.com/company/name]",
        "youtube": "[Real YouTube URL if exists - e.g., https://youtube.com/@username]"
      },
      "followers": [realistic follower/customer count based on typical market sizes],
      "engagement": [realistic engagement rate 1-8% based on industry standards],
      "strengths": ["[Real competitive advantage]", "[Actual market position]", "[Genuine operational strength]"],
      "weaknesses": ["[Real market gap]", "[Actual service limitation]", "[Genuine opportunity for improvement]"]
    }
  ],
  "contentGaps": [
    "[Real content gap based on actual market analysis]",
    "[Genuine customer pain point with evidence]",
    "[Practical content opportunity]",
    "[Realistic market trend or subtopic]",
    "[Achievable format or platform opportunity]"
  ],
  "monetizationStrategies": [
    "[Realistic primary revenue model with conservative pricing and conversion rates]",
    "[Practical secondary income stream with achievable projections]",
    "[Genuine affiliate/partnership opportunities with realistic commissions]",
    "[Real product/service sales with typical profit margins]",
    "[Achievable consulting/coaching rates based on market standards]"
  ],
  "riskFactors": [
    "[Real market risk with practical mitigation strategy]",
    "[Genuine competition risk with realistic differentiation approach]",
    "[Actual market timing risk with monitoring strategy]",
    "[Realistic customer acquisition challenge with practical solutions]",
    "[Genuine operational risk with resource planning]"
  ],
  "timeToMarket": "[Conservative timeline with realistic phases - e.g., '3-4 months for initial launch, 6-9 months for market establishment']",
  "successRoadmap": {
    "phase1": {
      "timeline": "[Conservative timeframe - e.g., 'Months 1-3']",
      "objectives": ["[Realistic goal with measurable outcome]", "[Achievable milestone]", "[Practical task]"],
      "budget": "[Conservative budget range - e.g., '$1,000-3,000']",
      "keyActions": ["[Practical action with clear steps]", "[Realistic step with resource needs]", "[Achievable task]"]
    },
    "phase2": {
      "timeline": "[Realistic timeframe - e.g., 'Months 4-8']",
      "objectives": ["[Achievable growth goal]", "[Realistic expansion milestone]", "[Conservative revenue target]"],
      "budget": "[Practical budget range - e.g., '$3,000-8,000']",
      "keyActions": ["[Realistic scaling strategy]", "[Practical marketing initiative]", "[Achievable product development]"]
    },
    "phase3": {
      "timeline": "[Long-term timeframe - e.g., 'Months 9-18']",
      "objectives": ["[Sustainable growth goal]", "[Realistic revenue target]", "[Achievable market position]"],
      "budget": "[Conservative budget range - e.g., '$8,000-20,000']",
      "keyActions": ["[Sustainable growth strategy]", "[Advanced monetization]", "[Market positioning]"]
    }
  }
}

AUTHENTICITY STANDARDS:
- All competitor data must reference real companies that actually exist
- Content gaps must be based on genuine market research and analysis
- Monetization strategies must be proven and currently working in similar markets
- Risk factors must be realistic challenges that businesses actually face
- Success roadmap must be conservative and achievable for typical entrepreneurs
- All financial projections must be realistic and based on actual market conditions

Provide honest, realistic validation that helps users make informed decisions based on actual market conditions and genuine opportunities.
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
        throw new Error('Market analysis incomplete. Please try again with a more specific topic.');
      }
      
      // Enhanced validation and realistic data structure
      const report: ValidationReport = {
        id: '',
        nicheId,
        userId,
        profitabilityScore: Math.max(30, Math.min(85, aiData.profitabilityScore || 65)),
        audienceSize: Math.max(5000, Math.min(500000, aiData.audienceSize || 25000)),
        competitorAnalysis: Array.isArray(aiData.competitors) ? aiData.competitors : [],
        contentGaps: Array.isArray(aiData.contentGaps) ? aiData.contentGaps : [],
        monetizationStrategies: Array.isArray(aiData.monetizationStrategies) ? aiData.monetizationStrategies : [],
        riskFactors: Array.isArray(aiData.riskFactors) ? aiData.riskFactors : [],
        timeToMarket: aiData.timeToMarket || '4-8 months for market establishment',
        successRoadmap: aiData.successRoadmap || {},
        generatedAt: new Date()
      };
      
      // Validate competitor data for realism
      if (report.competitorAnalysis.length > 0) {
        report.competitorAnalysis = report.competitorAnalysis.map(competitor => ({
          ...competitor,
          followers: Math.max(1000, Math.min(1000000, competitor.followers || 10000)),
          engagement: Math.max(0.5, Math.min(8, competitor.engagement || 2.5))
        }));
      }

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