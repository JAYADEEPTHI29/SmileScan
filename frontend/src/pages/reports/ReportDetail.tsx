import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Printer, FileText } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useScans } from '../../hooks/useScans';
import { generateMedicalReportPDF } from '../../services/pdfService';

export const ReportDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { scans } = useScans();
  const navigate = useNavigate();

  const report = scans.find(s => s.id === id) || scans[0];

  if (!report) {
    return <div className="p-8 text-center text-slate-500">Report document not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/reports')}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          <ArrowLeft size={16} /> Back to Reports List
        </button>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Printer size={16} />}
            onClick={() => window.print()}
          >
            Print
          </Button>
          <Button
            size="sm"
            leftIcon={<Download size={16} />}
            onClick={() => generateMedicalReportPDF(report)}
          >
            Download PDF
          </Button>
        </div>
      </div>

      {/* Report Document Box Preview */}
      <Card className="p-8 space-y-6 border-slate-300 dark:border-slate-700">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-primary">SMILESCAN DENTAL CLINIC</h2>
            <p className="text-xs text-slate-500">AI Clinical Decision Support Report #{report.id}</p>
          </div>
          <div className="text-right text-xs text-slate-500">
            <div>Date: {new Date(report.createdAt).toLocaleDateString()}</div>
            <div>Status: <span className="font-bold text-emerald-500">{report.status}</span></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <h4 className="font-bold text-slate-900 dark:text-white mb-1">PATIENT INFO</h4>
            <p>Name: {report.patientName}</p>
            <p>ID: #{report.patientId}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <h4 className="font-bold text-slate-900 dark:text-white mb-1">PRACTITIONER INFO</h4>
            <p>Doctor: {report.doctorName}</p>
            <p>Dept: Endodontics & Radiology</p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">AI Diagnostic Finding</h3>
          <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-xs space-y-1">
            <div className="font-extrabold text-sm text-primary">{report.predictions[0]?.disease}</div>
            <div>Confidence Rating: {report.overallConfidence}%</div>
            <div>Affected Teeth: #{report.predictions[0]?.affectedTeeth.join(', ')}</div>
            <div>Severity: {report.overallSeverity}</div>
          </div>
        </div>
      </Card>
    </div>
  );
};
