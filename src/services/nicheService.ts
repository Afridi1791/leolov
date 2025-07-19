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
You are a world-class market research analyst with 20+ years of experience and access to comprehensive market intelligence databases. You have successfully identified over 10,000 profitable niches and helped entrepreneurs generate millions in revenue.

CRITICAL INSTRUCTIONS:
- Conduct REAL market research using your knowledge of actual market data
- Provide GENUINE search volumes based on real market conditions
- Identify ACTUAL competitors and market players
- Give REALISTIC monetization scores based on proven revenue models
- Use CURRENT market trends and consumer behavior patterns
- Base competition levels on REAL market saturation analysis

Topic to analyze: "${topic}"

RESEARCH METHODOLOGY:
1. Analyze current Google Trends data and search patterns
2. Identify real market gaps and underserved segments
3. Research actual competitors and their performance metrics
4. Evaluate proven monetization strategies in this space
5. Assess market timing and growth potential
6. Consider seasonal trends and market cycles

Find 4-6 highly profitable micro-niches within "${topic}" that meet these criteria:
- Minimum 1,000+ monthly searches but under 50,000 (sweet spot for low competition)
- Clear monetization potential with proven revenue models
- Identifiable target audience with specific pain points
- Growing market trend (not declining)
- Realistic entry barriers for new entrepreneurs

For each micro-niche, provide:
- EXACT search volume estimates based on keyword research
- REAL competition analysis (not generic low/medium/high)
- SPECIFIC examples of successful products/services in this space
- ACCURATE monetization potential based on market data
- GENUINE validation indicators

Return ONLY valid JSON with this exact structure:

{
  "overallSearchVolume": [realistic monthly search volume for main topic],
  "overallCompetition": "[low/medium/high based on actual market saturation]",
  "monetizationPotential": [score 1-100 based on real revenue opportunities and market size],
  "microNiches": [
    {
      "name": "[Specific, actionable micro-niche name targeting exact audience]",
      "description": "[Detailed description of target audience, their specific pain points, and why this niche is profitable - 200-250 chars]",
      "searchVolume": [exact monthly search volume based on keyword research],
      "competition": "[low/medium/high with specific reasoning]",
      "monetizationScore": [1-100 score based on proven revenue models and market size],
      "examples": ["[Real product/service example with price point]", "[Actual successful brand/company in this space]", "[Specific monetization method with revenue potential]"],
      "validationScore": [1-100 based on market demand indicators, search trends, and competition analysis]
    }
  ]
}

QUALITY STANDARDS:
- Search volumes must be realistic and based on actual keyword data
- Competition levels must reflect real market conditions
- Examples must be specific, actionable, and profitable
- Monetization scores must be based on proven revenue models
- All data must be current and relevant to 2024-2025 market conditions

Provide market intelligence that entrepreneurs can act on immediately with complete confidence.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean the response text more thoroughly
      let cleanText = text.trim();
      
      // Remove markdown code blocks
      cleanText = cleanText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      // Remove any leading/trailing whitespace and newlines
      cleanText = cleanText.replace(/^\s+|\s+$/g, '');
      
      // Find the JSON object (starts with { and ends with })
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

      // Validate the AI response structure
      if (!aiData.microNiches || !Array.isArray(aiData.microNiches)) {
        throw new Error('Invalid AI response structure');
      }
      
      const nicheData: NicheData = {
        id: '',
        topic,
        microNiches: aiData.microNiches.map((niche: any) => ({
          ...niche,
          trends: this.generateRealisticTrends(niche.searchVolume)
        })),
        searchVolume: aiData.overallSearchVolume,
        competition: aiData.overallCompetition,
        monetizationPotential: aiData.monetizationPotential,
        timestamp: new Date(),
        userId
      };

      // Save to Firestore
      const docRef = await addDoc(collection(db, 'niches'), nicheData);
      nicheData.id = docRef.id;

      return nicheData;
    } catch (error) {
      console.error('Error analyzing niche:', error);
      throw new Error('Failed to analyze niche. Please try again.');
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
You are a senior business consultant and market validation expert who has helped over 500 startups successfully launch and scale. You specialize in comprehensive market analysis and have access to premium market intelligence tools.

VALIDATION MISSION:
Conduct a comprehensive, actionable market validation report for the micro-niche: "${microNiche.name}"

CURRENT MARKET CONTEXT:
- Description: ${microNiche.description}
- Monthly Search Volume: ${microNiche.searchVolume}
- Competition Level: ${microNiche.competition}
- Current Monetization Score: ${microNiche.monetizationScore}%

RESEARCH REQUIREMENTS:
1. COMPETITOR INTELLIGENCE: Identify 3-5 real competitors/brands in this exact niche
2. MARKET GAP ANALYSIS: Find specific, actionable content/product gaps
3. REVENUE MODEL VALIDATION: Provide proven monetization strategies with realistic revenue projections
4. RISK ASSESSMENT: Identify genuine market risks and mitigation strategies
5. GO-TO-MARKET TIMELINE: Realistic launch timeline with key milestones

COMPETITOR RESEARCH CRITERIA:
- Find actual brands, influencers, or companies in this space
- Provide realistic follower/customer counts
- Identify specific competitive advantages and weaknesses
- Focus on actionable competitive intelligence

MARKET GAP ANALYSIS:
- Identify specific unmet needs in the market
- Find content topics that competitors aren't covering
- Discover product/service opportunities
- Highlight underserved customer segments

MONETIZATION VALIDATION:
- Provide specific revenue models that work in this niche
- Include realistic pricing strategies and revenue projections
- Consider multiple income streams
- Factor in market size and customer acquisition costs

Return ONLY valid JSON with this exact structure:

{
  "profitabilityScore": [1-100 score based on comprehensive market analysis, revenue potential, and market conditions],
  "audienceSize": [realistic total addressable market size based on search volume and market research],
  "competitors": [
    {
      "name": "[Real competitor name or realistic market player]",
      "followers": [realistic audience/customer count],
      "engagement": [realistic engagement rate 1-15%]",
      "strengths": ["[Specific competitive advantage 1]", "[Specific competitive advantage 2]", "[Specific competitive advantage 3]"],
      "weaknesses": ["[Specific market gap/weakness 1]", "[Specific market gap/weakness 2]", "[Opportunity for new entrants]"]
    }
  ],
  "contentGaps": [
    "[Specific content topic/format that's underserved in the market]",
    "[Particular customer pain point not being addressed]",
    "[Content angle or approach that competitors are missing]",
    "[Emerging trend or subtopic with low competition]",
    "[Specific format or platform opportunity]"
  ],
  "monetizationStrategies": [
    "[Specific revenue model with realistic pricing - e.g., 'Digital course priced at $197-$497']",
    "[Another proven monetization method with revenue range]",
    "[Third revenue stream with specific implementation details]",
    "[Additional income source with market validation]",
    "[Scalable revenue model with growth potential]"
  ],
  "riskFactors": [
    "[Specific market risk with mitigation strategy]",
    "[Competition risk and how to differentiate]",
    "[Market timing or trend risk assessment]",
    "[Customer acquisition challenge and solution]"
  ],
  "timeToMarket": "[Realistic timeline like '3-6 months for MVP, 8-12 months for full launch']"
}

QUALITY STANDARDS:
- All competitor data must be realistic and market-appropriate
- Content gaps must be specific and actionable
- Monetization strategies must include specific pricing and revenue projections
- Risk factors must be genuine market concerns with practical solutions
- Timeline must be realistic based on niche complexity and market conditions

Provide validation intelligence that enables immediate, confident business decisions.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean the response text more thoroughly
      let cleanText = text.trim();
      
      // Remove markdown code blocks
      cleanText = cleanText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      // Remove any leading/trailing whitespace and newlines
      cleanText = cleanText.replace(/^\s+|\s+$/g, '');
      
      // Find the JSON object (starts with { and ends with })
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
      
      const report: ValidationReport = {
        id: '',
        nicheId,
        userId,
        profitabilityScore: aiData.profitabilityScore,
        audienceSize: aiData.audienceSize,
        competitorAnalysis: aiData.competitors,
        contentGaps: aiData.contentGaps,
        monetizationStrategies: aiData.monetizationStrategies,
        riskFactors: aiData.riskFactors,
        timeToMarket: aiData.timeToMarket,
        generatedAt: new Date()
      };

      // Save to Firestore
      const docRef = await addDoc(collection(db, 'reports'), report);
      report.id = docRef.id;

      return report;
    } catch (error) {
      console.error('Error generating validation report:', error);
      throw new Error('Failed to generate validation report. Please try again.');
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

    // Create more realistic trend patterns based on actual search behavior
    for (let i = 0; i < 90; i += 3) { // Every 3 days
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      // Realistic trend simulation with multiple factors
      const seasonalTrend = Math.sin((i / 90) * Math.PI * 2) * 0.3; // Seasonal variation
      const weeklyPattern = Math.sin((i / 7) * Math.PI * 2) * 0.15; // Weekly patterns
      const randomVariation = (Math.random() - 0.5) * 0.2; // Random market noise
      const growthTrend = (i / 90) * 0.1; // Slight growth trend
      
      // Calculate search volume with realistic bounds
      const trendMultiplier = 1 + seasonalTrend + weeklyPattern + randomVariation + growthTrend;
      const searchVolume = Math.max(
        Math.floor(baseSearchVolume * 0.1), // Minimum 10% of base
        Math.floor(baseSearchVolume * trendMultiplier)
      );
      
      // Realistic engagement rates (2-12% based on niche)
      const baseEngagement = baseSearchVolume > 10000 ? 3 : 8; // Higher volume = lower engagement
      const engagement = Math.max(1, Math.min(15, 
        baseEngagement + (Math.random() - 0.5) * 4
      ));
      
      // Mentions correlated with search volume and engagement
      const mentions = Math.floor((searchVolume / 1000) * engagement * (0.5 + Math.random()));
      
      trends.push({
        date: date.toISOString().split('T')[0],
        searchVolume: Math.floor(searchVolume),
        engagement: Math.floor(engagement * 10) / 10, // One decimal place
        mentions: Math.max(1, mentions)
      });
    }

    return trends;
  }
}