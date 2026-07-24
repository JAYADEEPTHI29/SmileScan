import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Download, Printer, ArrowLeft, ShieldAlert, CheckCircle2, Pill, Stethoscope, Home, Sparkles } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { DentalTeethChart } from '../../components/dental/DentalTeethChart';
import { generateMedicalReportPDF } from '../../services/pdfService';
import { ScanReport } from '../../types/scan';

export const ScanResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const report: ScanReport | undefined = location.state?.report;

  if (!report) {
    return (
      <div className="p-8 text-center text-slate-500">
        No active scan report selected.{' '}
        <Button onClick={() => navigate('/scan/new')} variant="outline">
          Run New Scan
        </Button>
      </div>
    );
  }

  const primaryPrediction = report.predictions[0];
  const affectedTeethList = primaryPrediction?.affectedTeeth || [];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Navigation & Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Printer size={16} />}
            onClick={handlePrint}
          >
            Print Report
          </Button>
          <Button
            size="sm"
            leftIcon={<Download size={16} />}
            onClick={() => generateMedicalReportPDF(report)}
          >
            Download Medical PDF
          </Button>
        </div>
      </div>

      {/* Main Diagnostic Summary Card */}
      <Card className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border-none shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="text-secondary animate-pulse" size={18} />
              <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                AI Clinical Decision Support Verdict
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">{primaryPrediction?.disease || 'Dental Radiograph Analysis'}</h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Patient: <b>{report.patientName}</b> • Diagnostic Report ID: <b>#{report.id}</b>
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <div className="text-center">
              <span className="text-[10px] text-slate-300 uppercase font-semibold block">Confidence</span>
              <span className="text-2xl font-black text-emerald-400">{report.overallConfidence}%</span>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <span className="text-[10px] text-slate-300 uppercase font-semibold block">Severity</span>
              <Badge variant={report.overallSeverity === 'High' ? 'danger' : 'warning'} className="mt-1">
                {report.overallSeverity}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Radiograph & Tooth Map Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Uploaded Radiograph Image</h3>
            <span className="text-xs font-semibold text-primary">{report.imageType}</span>
          </div>
          <div className="h-64 sm:h-80 rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center">
            <img src={report.imageUrl} alt="Radiograph Scan" className="max-h-full max-w-full object-contain" />
          </div>
        </Card>

        <DentalTeethChart affectedTeeth={affectedTeethList} />
      </div>

      {/* Structured Clinical Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recommended Treatment */}
        <Card className="space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="text-emerald-500" size={18} /> Recommended Procedures & Treatment
          </h3>
          <ul className="space-y-2">
            {primaryPrediction?.recommendedTreatment.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                <span className="w-5 h-5 rounded-full bg-primary-50 dark:bg-primary-950 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Prescribed Medications */}
        <Card className="space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Pill className="text-primary" size={18} /> Suggested Prescription Medications
          </h3>
          <div className="space-y-2">
            {primaryPrediction?.suggestedMedicines.map((med, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800 text-xs">
                <div className="font-bold text-slate-900 dark:text-white flex justify-between">
                  <span>{med.name}</span>
                  <span className="text-primary">{med.dosage}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Duration: {med.duration}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Home Care & Specialist Referral */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Home className="text-amber-500" size={18} /> Patient Home Care Instructions
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            {primaryPrediction?.homeRemedies.map((rem, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>{rem}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Stethoscope className="text-teal-500" size={18} /> Specialist Referral Flag
          </h3>
          <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
            <span className="text-xs font-bold text-teal-800 dark:text-teal-300 block">
              Recommended Referral Specialist:
            </span>
            <span className="text-base font-extrabold text-teal-900 dark:text-teal-100 mt-1 block">
              {primaryPrediction?.specialistRecommendation}
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
};
