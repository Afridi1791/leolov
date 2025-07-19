import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy,
  doc,
  getDoc 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { ValidationReport } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export class ReportsService {
  static async getUserReports(userId: string): Promise<ValidationReport[]> {
    try {
      // Temporary fix: Remove orderBy to avoid composite index requirement
      // The results will be sorted in the component instead
      const q = query(
        collection(db, 'reports'),
        where('userId', '==', userId)
      );
      
      const snapshot = await getDocs(q);
      const reports = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        generatedAt: doc.data().generatedAt.toDate(),
      } as ValidationReport));
      
      // Sort the results by generatedAt in descending order (newest first)
      return reports.sort((a, b) => {
        const dateA = a.generatedAt?.toDate?.() || new Date(a.generatedAt);
        const dateB = b.generatedAt?.toDate?.() || new Date(b.generatedAt);
        return dateB.getTime() - dateA.getTime();
      });
    } catch (error) {
      console.error('Error fetching user reports:', error);
      return [];
    }
  }

  static async getReportById(reportId: string): Promise<ValidationReport | null> {
    try {
      const reportRef = doc(db, 'reports', reportId);
      const reportDoc = await getDoc(reportRef);
      
      if (reportDoc.exists()) {
        return {
          id: reportDoc.id,
          ...reportDoc.data(),
          generatedAt: reportDoc.data().generatedAt.toDate(),
        } as ValidationReport;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching report:', error);
      return null;
    }
  }

  static async downloadReportPDF(report: ValidationReport): Promise<void> {
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Title
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('NicheNav Validation Report', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // Report ID and Date
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Report ID: #${report.id.slice(-6)}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Generated: ${new Date(report.generatedAt).toLocaleDateString()}`, 20, yPosition);
      yPosition += 20;

      // Key Metrics
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Key Metrics', 20, yPosition);
      yPosition += 15;

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Profitability Score: ${report.profitabilityScore}%`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Audience Size: ${report.audienceSize.toLocaleString()}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Time to Market: ${report.timeToMarket}`, 20, yPosition);
      yPosition += 20;

      // Competitor Analysis
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Competitor Analysis', 20, yPosition);
      yPosition += 15;

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      report.competitorAnalysis.forEach((competitor, index) => {
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFont('helvetica', 'bold');
        pdf.text(`${index + 1}. ${competitor.name}`, 20, yPosition);
        yPosition += 8;
        
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Followers: ${competitor.followers.toLocaleString()} | Engagement: ${competitor.engagement}%`, 25, yPosition);
        yPosition += 8;
        
        pdf.text('Strengths:', 25, yPosition);
        yPosition += 6;
        competitor.strengths.forEach(strength => {
          pdf.text(`• ${strength}`, 30, yPosition);
          yPosition += 6;
        });
        
        pdf.text('Weaknesses:', 25, yPosition);
        yPosition += 6;
        competitor.weaknesses.forEach(weakness => {
          pdf.text(`• ${weakness}`, 30, yPosition);
          yPosition += 6;
        });
        yPosition += 8;
      });

      // Content Gaps
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Content Gaps', 20, yPosition);
      yPosition += 15;

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      report.contentGaps.forEach((gap, index) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(`${index + 1}. ${gap}`, 20, yPosition);
        yPosition += 8;
      });

      // Monetization Strategies
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = 20;
      }

      yPosition += 10;
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Monetization Strategies', 20, yPosition);
      yPosition += 15;

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      report.monetizationStrategies.forEach((strategy, index) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(`${index + 1}. ${strategy}`, 20, yPosition);
        yPosition += 8;
      });

      // Risk Factors
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = 20;
      }

      yPosition += 10;
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Risk Factors', 20, yPosition);
      yPosition += 15;

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      report.riskFactors.forEach((risk, index) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(`${index + 1}. ${risk}`, 20, yPosition);
        yPosition += 8;
      });

      // Success Roadmap
      if (report.successRoadmap && Object.keys(report.successRoadmap).length > 0) {
        if (yPosition > pageHeight - 60) {
          pdf.addPage();
          yPosition = 20;
        }

        yPosition += 10;
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Success Roadmap', 20, yPosition);
        yPosition += 15;

        Object.entries(report.successRoadmap).forEach(([phase, data], index) => {
          if (yPosition > pageHeight - 80) {
            pdf.addPage();
            yPosition = 20;
          }

          pdf.setFontSize(14);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`${phase.replace('phase', 'Phase ').toUpperCase()}`, 20, yPosition);
          yPosition += 8;
          
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'normal');
          pdf.text(`Timeline: ${data.timeline}`, 25, yPosition);
          yPosition += 6;
          pdf.text(`Budget: ${data.budget}`, 25, yPosition);
          yPosition += 10;
          
          pdf.setFont('helvetica', 'bold');
          pdf.text('Objectives:', 25, yPosition);
          yPosition += 6;
          pdf.setFont('helvetica', 'normal');
          data.objectives?.forEach(objective => {
            if (yPosition > pageHeight - 20) {
              pdf.addPage();
              yPosition = 20;
            }
            pdf.text(`• ${objective}`, 30, yPosition);
            yPosition += 6;
          });
          
          yPosition += 4;
          pdf.setFont('helvetica', 'bold');
          pdf.text('Key Actions:', 25, yPosition);
          yPosition += 6;
          pdf.setFont('helvetica', 'normal');
          data.keyActions?.forEach(action => {
            if (yPosition > pageHeight - 20) {
              pdf.addPage();
              yPosition = 20;
            }
            pdf.text(`• ${action}`, 30, yPosition);
            yPosition += 6;
          });
          yPosition += 10;
        });
      }

      // Footer
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(
          `Generated by NicheNav - Page ${i} of ${totalPages}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }

      // Save the PDF
      pdf.save(`NicheNav-Report-${report.id.slice(-6)}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF report');
    }
  }
}