import React, { useState } from 'react';
import { TrendingUp, Users, DollarSign, FileText, Download } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { NicheData, MicroNiche } from '../../types';
import { NicheService } from '../../services/nicheService';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface NicheResultsProps {
  nicheData: NicheData | null;
}

export function NicheResults({ nicheData }: NicheResultsProps) {
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);
  const { currentUser, canGenerateReport, incrementReportUsage } = useAuth();

  if (!nicheData) {
    return (
      <Card>
        <div className="text-center text-gray-500 py-12">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Analyze a niche to see detailed results</p>
        </div>
      </Card>
    );
  }

  const handleGenerateReport = async (microNiche: MicroNiche) => {
    if (!currentUser) {
      toast.error('Please sign in to generate reports');
      return;
    }

    if (!canGenerateReport()) {
      toast.error('You have reached your report limit. Upgrade to premium for unlimited reports.');
      return;
    }

    setGeneratingReport(microNiche.name);
    try {
      const report = await NicheService.generateValidationReport(nicheData.id, microNiche, currentUser.uid);
      await incrementReportUsage();
      
      toast.success('Validation report generated successfully!');
      
      setTimeout(() => {
        window.location.href = '/reports';
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate report');
    } finally {
      setGeneratingReport(null);
    }
  };

  const getCompetitionColor = (competition: string) => {
    switch (competition) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Analysis Results</h3>
          <span className="text-sm text-gray-500">
            {new Date(nicheData.timestamp).toLocaleDateString()}
          </span>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-gray-900 mb-2">Topic: "{nicheData.topic}"</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Search Volume:</span>
              <span className="font-medium ml-2">{nicheData.searchVolume.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-600">Competition:</span>
              <span className={`font-medium ml-2 px-2 py-1 rounded text-xs ${getCompetitionColor(nicheData.competition)}`}>
                {nicheData.competition}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Opportunity:</span>
              <span className="font-medium ml-2">{nicheData.monetizationPotential}/100</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {nicheData.microNiches.map((niche, index) => (
          <Card key={index} hover>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{niche.name}</h4>
                <p className="text-gray-600 mb-4">{niche.description}</p>
              </div>
              <div className="ml-4">
                <Button
                  onClick={() => handleGenerateReport(niche)}
                  loading={generatingReport === niche.name}
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Search Volume</p>
                  <p className="font-semibold">{niche.searchVolume.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Monetization</p>
                  <p className="font-semibold">{niche.monetizationScore}%</p>
                </div>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 text-purple-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Competition</p>
                  <span className={`font-semibold px-2 py-1 rounded text-xs ${getCompetitionColor(niche.competition)}`}>
                    {niche.competition}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Examples:</p>
              <div className="flex flex-wrap gap-2">
                {niche.examples.map((example, exampleIndex) => (
                  <span
                    key={exampleIndex}
                    className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                  >
                    {example}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Validation Score</span>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${niche.validationScore}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold">{niche.validationScore}%</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}