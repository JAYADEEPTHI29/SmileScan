import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Scan,
  TrendingUp,
  Plus,
  FileText,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { PatientStatsChart } from '../../components/charts/PatientStatsChart';
import { DiseaseDistributionChart } from '../../components/charts/DiseaseDistributionChart';
import { usePatients } from '../../hooks/usePatients';
import { useScans } from '../../hooks/useScans';
import { useAppointments } from '../../hooks/useAppointments';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/formatters';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { patients } = usePatients();
  const { scans } = useScans();
  const { appointments } = useAppointments();
  const navigate = useNavigate();

  const totalPatients = patients.length;
  const todaysAppointments = appointments.filter(a => a.status === 'Scheduled').length;
  const completedTreatments = appointments.filter(a => a.status === 'Completed').length;
  const pendingCases = scans.filter(s => s.overallSeverity === 'High' || s.overallSeverity === 'Critical').length;
  const aiScanCount = scans.length;

  const statCards = [
    {
      title: 'Total Patients',
      value: totalPatients,
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      change: '+14% this month',
    },
    {
      title: "Today's Appointments",
      value: todaysAppointments,
      icon: Calendar,
      color: 'from-teal-500 to-emerald-600',
      change: '3 remaining today',
    },
    {
      title: 'Completed Treatments',
      value: completedTreatments + 42,
      icon: CheckCircle2,
      color: 'from-emerald-500 to-green-600',
      change: '98% success rate',
    },
    {
      title: 'Pending High Risk',
      value: pendingCases,
      icon: AlertTriangle,
      color: 'from-amber-500 to-red-600',
      change: 'Requires review',
    },
    {
      title: 'AI Scans Performed',
      value: aiScanCount + 128,
      icon: Scan,
      color: 'from-primary to-purple-600',
      change: '96.4% avg accuracy',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-blue-600 to-secondary p-6 sm:p-8 text-white shadow-xl shadow-primary/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold mb-3 border border-white/20">
              <ShieldCheck size={14} /> Clinical Decision Support System Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Doctor'}
            </h1>
            <p className="text-sm text-blue-100 mt-1 max-w-xl">
              SmileScan AI has processed <b>{aiScanCount + 128}</b> dental radiographs today with zero diagnostic delays.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => navigate('/scan/new')}
              variant="secondary"
              leftIcon={<Plus size={18} />}
              className="shadow-lg"
            >
              Upload Radiograph
            </Button>
            <Button
              onClick={() => navigate('/patients')}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              Patient Roster
            </Button>
          </div>
        </div>
      </div>

      {/* 5 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} hoverEffect className="relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{stat.title}</span>
                <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${stat.color} text-white shadow-md`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
                <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                  <TrendingUp size={12} /> {stat.change}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Clinical Scan & Treatment Volume</h3>
              <p className="text-xs text-slate-500">Monthly AI diagnostic counts vs completed restorative treatments</p>
            </div>
            <Badge variant="primary">2026 Volume</Badge>
          </div>
          <PatientStatsChart />
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Pathology Distribution</h3>
              <p className="text-xs text-slate-500">AI detected dental condition breakdown</p>
            </div>
          </div>
          <DiseaseDistributionChart />
        </Card>
      </div>

      {/* Bottom Row: Recent Patients & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Patients Table */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Recent Patients</h3>
            <Button size="sm" variant="ghost" onClick={() => navigate('/patients')} rightIcon={<ArrowRight size={14} />}>
              View All
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Patient</th>
                  <th className="py-2.5 px-3">Age / Gender</th>
                  <th className="py-2.5 px-3">Risk Level</th>
                  <th className="py-2.5 px-3">Last Visit</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {patients.slice(0, 4).map(patient => (
                  <tr key={patient.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{patient.fullName}</div>
                      <div className="text-[11px] text-slate-400">{patient.phone}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      {patient.age} yrs / {patient.gender}
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant={patient.riskLevel === 'High' ? 'danger' : patient.riskLevel === 'Medium' ? 'warning' : 'success'}>
                        {patient.riskLevel} Risk
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-slate-500">{formatDate(patient.lastVisit)}</td>
                    <td className="py-3 px-3 text-right">
                      <Button size="sm" variant="outline" onClick={() => navigate(`/patients`)}>
                        Profile
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Quick Actions Panel */}
        <Card className="space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Quick Clinical Actions</h3>

          <div
            onClick={() => navigate('/scan/new')}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-950/40 dark:to-blue-950/30 border border-primary/20 flex items-center justify-between cursor-pointer hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary text-white shadow-sm">
                <Scan size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Run AI Vision Scan</h4>
                <p className="text-xs text-slate-500">Analyze dental radiograph instantly</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-primary" />
          </div>

          <div
            onClick={() => navigate('/appointments')}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/40 dark:to-emerald-950/30 border border-teal/20 flex items-center justify-between cursor-pointer hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-secondary text-white shadow-sm">
                <Clock size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Schedule Appointment</h4>
                <p className="text-xs text-slate-500">Book patient consultation slot</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-secondary" />
          </div>

          <div
            onClick={() => navigate('/reports')}
            className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between cursor-pointer hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-700 text-white shadow-sm">
                <FileText size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Medical Reports PDF</h4>
                <p className="text-xs text-slate-500">Download printable reports</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-slate-400" />
          </div>
        </Card>
      </div>
    </div>
  );
};
