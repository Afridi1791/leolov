import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Eye, Calendar, TrendingUp, Users, DollarSign, AlertTriangle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useAuth } from '../../contexts/AuthContext';
import { ReportsService } from '../../services/reportsService';
import { ValidationReport } from '../../types';
import toast from 'react-hot-toast';

export function ReportsPage() {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState<ValidationReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ValidationReport | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadReports();
    }
  }, [currentUser]);

  const loadReports = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const userReports = await ReportsService.getUserReports(currentUser.uid);
      setReports(userReports);
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = (report: ValidationReport) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  const handleDownloadReport = async (report: ValidationReport) => {
    try {
      await ReportsService.downloadReportPDF(report);
      toast.success('Report downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download report');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your reports...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Validation Reports</h1>
          <p className="text-gray-600">View and manage all your generated niche validation reports</p>
        </motion.div>

        {reports.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reports Yet</h3>
            <p className="text-gray-600 mb-6">
              Generate your first validation report by analyzing a niche in the dashboard
            </p>
            <Button onClick={() => window.location.href = '/dashboard'}>
              Go to Dashboard
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6">
            {reports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <FileText className="w-5 h-5 text-blue-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          Validation Report #{report.id.slice(-6)}
                        </h3>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-4">
                        <Calendar className="w-4 h-4 mr-1" />
                        Generated on {new Date(report.generatedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => handleViewReport(report)}
                        size="sm"
                        variant="outline"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button
                        onClick={() => handleDownloadReport(report)}
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center">
                      <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                      <div>
                        <p className="text-sm text-gray-600">Profitability</p>
                        <p className="font-semibold">{report.profitabilityScore}%</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-blue-600 mr-2" />
                      <div>
                        <p className="text-sm text-gray-600">Audience Size</p>
                        <p className="font-semibold">{report.audienceSize.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-5 h-5 text-purple-600 mr-2" />
                      <div>
                        <p className="text-sm text-gray-600">Strategies</p>
                        <p className="font-semibold">{report.monetizationStrategies.length}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
                      <div>
                        <p className="text-sm text-gray-600">Risk Factors</p>
                        <p className="font-semibold">{report.riskFactors.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Time to Market</span>
                      <span className="text-sm font-semibold text-gray-900">{report.timeToMarket}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Report Detail Modal */}
        <Modal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          title="Validation Report Details"
          size="xl"
        >
          {selectedReport && (
            <div className="space-y-6">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Report #{selectedReport.id.slice(-6)}
                </h3>
                <p className="text-gray-600">
                  Generated on {new Date(selectedReport.generatedAt).toLocaleDateString()}
                </p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {selectedReport.profitabilityScore}%
                  </div>
                  <div className="text-sm text-gray-600">Profitability Score</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {selectedReport.audienceSize.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Audience Size</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {selectedReport.competitorAnalysis.length}
                  </div>
                  <div className="text-sm text-gray-600">Competitors</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    {selectedReport.timeToMarket}
                  </div>
                  <div className="text-sm text-gray-600">Time to Market</div>
                </div>
              </div>

              {/* Competitor Analysis */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Competitor Analysis</h4>
                <div className="space-y-4">
                  {selectedReport.competitorAnalysis.map((competitor, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-900">{competitor.name}</h5>
                        <div className="text-sm text-gray-600">
                          {competitor.followers.toLocaleString()} followers • {competitor.engagement}% engagement
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-green-600 mb-2">Strengths</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {competitor.strengths.map((strength, idx) => (
                              <li key={idx}>• {strength}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-red-600 mb-2">Weaknesses</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {competitor.weaknesses.map((weakness, idx) => (
                              <li key={idx}>• {weakness}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Gaps */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Content Gaps</h4>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {selectedReport.contentGaps.map((gap, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-700">{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Monetization Strategies */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Monetization Strategies</h4>
                <div className="bg-green-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {selectedReport.monetizationStrategies.map((strategy, index) => (
                      <li key={index} className="flex items-start">
                        <DollarSign className="w-4 h-4 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{strategy}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Risk Factors */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Risk Factors</h4>
                <div className="bg-red-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {selectedReport.riskFactors.map((risk, index) => (
                      <li key={index} className="flex items-start">
                        <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <Button
                  onClick={() => handleDownloadReport(selectedReport)}
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button onClick={() => setShowReportModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}