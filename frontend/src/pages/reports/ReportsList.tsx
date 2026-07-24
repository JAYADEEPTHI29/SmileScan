import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, Eye, Calendar, User, Activity } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useScans } from '../../hooks/useScans';
import { generateMedicalReportPDF } from '../../services/pdfService';
import { formatDate } from '../../utils/formatters';

export const ReportsList: React.FC = () => {
  const { scans } = useScans();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Diagnostic Medical Reports</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Professional PDF diagnostic records stored in Firestore with digital verification
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {scans.map(scan => (
          <Card key={scan.id} hoverEffect className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-primary-50 dark:bg-primary-950/60 text-primary">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {scan.predictions[0]?.disease || 'Dental Radiograph Analysis'}
                  </h3>
                  <p className="text-xs text-slate-500">Report ID: #{scan.id}</p>
                </div>
              </div>
              <Badge variant={scan.overallSeverity === 'High' ? 'danger' : 'warning'}>
                {scan.overallSeverity} Risk
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">Patient Name</span>
                <span className="font-bold">{scan.patientName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">Attending Doctor</span>
                <span className="font-bold">{scan.doctorName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">Scan Date</span>
                <span className="font-bold">{formatDate(scan.createdAt)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">Confidence Rating</span>
                <span className="font-bold text-emerald-500">{scan.overallConfidence}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Eye size={15} />}
                onClick={() => navigate('/scan/result', { state: { report: scan } })}
              >
                Inspect Results
              </Button>

              <Button
                size="sm"
                leftIcon={<Download size={15} />}
                onClick={() => generateMedicalReportPDF(scan)}
              >
                Download PDF
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
