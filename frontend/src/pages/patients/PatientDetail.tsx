import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  Scan,
  Activity,
  ArrowLeft,
  Plus,
  Clock,
  ChevronRight
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { usePatients } from '../../hooks/usePatients';
import { useScans } from '../../hooks/useScans';
import { formatDate, formatDateTime } from '../../utils/formatters';

export const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { patients } = usePatients();
  const { scans } = useScans();

  const [activeTab, setActiveTab] = useState<'overview' | 'scans' | 'reports'>('overview');

  const patient = patients.find(p => p.id === id) || patients[0];
  const patientScans = scans.filter(s => s.patientId === patient?.id || s.patientName === patient?.fullName);

  if (!patient) {
    return (
      <div className="p-8 text-center text-slate-500">
        Patient record not found.{' '}
        <Button onClick={() => navigate('/patients')} variant="outline">
          Back to Roster
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate('/patients')}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          <ArrowLeft size={16} /> Back to Patient Roster
        </button>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Clock size={15} />}
            onClick={() => navigate('/appointments')}
          >
            Book Appointment
          </Button>
          <Button
            size="sm"
            leftIcon={<Scan size={15} />}
            onClick={() => navigate('/scan/new')}
          >
            Run New AI Scan
          </Button>
        </div>
      </div>

      {/* Patient Profile Card Header */}
      <Card className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white text-2xl font-extrabold shadow-md">
            {patient.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">{patient.fullName}</h1>
              <Badge variant={patient.riskLevel === 'High' ? 'danger' : patient.riskLevel === 'Medium' ? 'warning' : 'success'}>
                {patient.riskLevel} Risk
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Patient ID: #{patient.id} • Registered: {formatDate(patient.createdAt)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-300 w-full md:w-auto">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Age / Gender</span>
            <span className="font-bold">{patient.age} yrs / {patient.gender}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Phone</span>
            <span className="font-bold">{patient.phone}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Last Clinical Visit</span>
            <span className="font-bold">{formatDate(patient.lastVisit)}</span>
          </div>
        </div>
      </Card>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {(['overview', 'scans', 'reports'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-bold rounded-xl capitalize transition-all ${
              activeTab === tab
                ? 'bg-primary text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab === 'overview' ? 'Medical & Dental History' : tab === 'scans' ? `AI Scans (${patientScans.length})` : 'PDF Reports'}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Activity size={16} className="text-red-500" /> Systemic Medical History
            </h3>
            <div className="flex flex-wrap gap-2">
              {patient.medicalHistory.length > 0 ? (
                patient.medicalHistory.map((item, i) => (
                  <span key={i} className="px-3 py-1 text-xs rounded-xl bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 font-medium border border-red-200">
                    {item}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">No reported systemic conditions.</span>
              )}
            </div>
          </Card>

          <Card className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <FileText size={16} className="text-primary" /> Past Dental Treatments
            </h3>
            <div className="flex flex-wrap gap-2">
              {patient.dentalHistory.length > 0 ? (
                patient.dentalHistory.map((item, i) => (
                  <span key={i} className="px-3 py-1 text-xs rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-medium border border-blue-200">
                    {item}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">No previous dental restorations recorded.</span>
              )}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'scans' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {patientScans.length === 0 ? (
            <Card className="p-8 text-center text-slate-400 text-xs">
              No AI scans recorded for this patient yet.
            </Card>
          ) : (
            patientScans.map(scan => (
              <Card key={scan.id} hoverEffect className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={scan.overallSeverity === 'High' ? 'danger' : 'warning'}>
                    {scan.overallSeverity} Severity
                  </Badge>
                  <span className="text-[11px] text-slate-400">{formatDateTime(scan.createdAt)}</span>
                </div>

                <div className="h-44 rounded-xl overflow-hidden bg-slate-900">
                  <img src={scan.imageUrl} alt="Dental Radiograph" className="w-full h-full object-cover" />
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {scan.predictions[0]?.disease || 'Radiograph Scan'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Teeth #: {scan.predictions[0]?.affectedTeeth.join(', ')} • Confidence: {scan.overallConfidence}%
                  </p>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === 'reports' && (
        <Card className="space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Generated Diagnostic Reports</h3>
          {patientScans.map(s => (
            <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs">
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-primary" />
                <div>
                  <span className="font-bold block">Clinical Decision Report #{s.id}</span>
                  <span className="text-slate-400">{formatDate(s.createdAt)}</span>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => navigate('/reports')}>
                View PDF Report
              </Button>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};
