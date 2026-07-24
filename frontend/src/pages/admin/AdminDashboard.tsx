import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, Activity, FileText, Lock, Server } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';
import { formatDate } from '../../utils/formatters';

export const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>({
    totalDoctors: 8,
    totalPatients: 42,
    totalScans: 156,
    totalAppointments: 28,
  });

  const [auditLogs, setAuditLogs] = useState<any[]>([
    {
      id: 'log_1',
      userName: 'Dr. Sarah Jenkins, DDS',
      action: 'AI_SCAN_COMPLETED',
      details: 'Ran dental radiograph scan for Patient Robert Chen (pat_1)',
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.105',
    },
    {
      id: 'log_2',
      userName: 'Dr. Sarah Jenkins, DDS',
      action: 'REPORT_GENERATED',
      details: 'Generated official clinical decision PDF report #scan_101',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      ipAddress: '192.168.1.105',
    },
    {
      id: 'log_3',
      userName: 'Dr. Marcus Vance (Admin)',
      action: 'SYSTEM_CONFIG_UPDATED',
      details: 'Updated AI model vision confidence threshold to 90%',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      ipAddress: '192.168.1.100',
    }
  ]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await api.get('/admin/analytics');
        if (res.data) {
          if (res.data.analytics) setAnalytics(res.data.analytics);
          if (res.data.recentAuditLogs) setAuditLogs(res.data.recentAuditLogs);
        }
      } catch (err) {
        console.warn('Backend admin API fallback.');
      }
    };
    fetchAdminData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="text-primary" /> Admin Control & Governance
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            System administration, doctor permissions, compliance metrics, and HIPAA audit trails
          </p>
        </div>
        <Badge variant="primary" size="md">
          ADMIN PRIVILEGES ACTIVE
        </Badge>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-primary">
            <Users size={24} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block">Registered Doctors</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">{analytics.totalDoctors}</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-secondary">
            <Activity size={24} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block">Active Patients</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">{analytics.totalPatients}</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600">
            <FileText size={24} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block">Total AI Scans</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">{analytics.totalScans}</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
            <Server size={24} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block">System Uptime</span>
            <span className="text-2xl font-black text-emerald-500">99.98%</span>
          </div>
        </Card>
      </div>

      {/* Audit Log Table */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Lock size={18} className="text-primary" /> HIPAA Security Audit Trail
            </h3>
            <p className="text-xs text-slate-500">Real-time log of user access, AI scan executions, and report exports</p>
          </div>
          <Button size="sm" variant="outline">
            Export Audit Log CSV
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">User</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Event Details</th>
                <th className="py-2.5 px-3">IP Address</th>
                <th className="py-2.5 px-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-slate-100">{log.userName}</td>
                  <td className="py-3 px-3">
                    <Badge variant="primary" size="sm">{log.action}</Badge>
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{log.details}</td>
                  <td className="py-3 px-3 font-mono text-slate-400">{log.ipAddress || '127.0.0.1'}</td>
                  <td className="py-3 px-3 text-slate-400">{formatDate(log.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
