import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Users, AlertTriangle, ShieldCheck, ArrowRight, Activity, Calendar } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useAuthContext } from '../../contexts/AuthContext';
import { patientService } from '../../services/patientService';
import { aiScanService } from '../../services/aiScanService';
import { Patient, Scan } from '../../types';

export const MobileDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [pList, sList] = await Promise.all([
          patientService.getPatients(),
          aiScanService.getScanHistory()
        ]);
        setPatients(pList);
        setScans(sList);
      } catch (err) {
        console.warn('Dashboard fetch notice:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const highRiskCount = patients.filter(p => p.riskLevel === 'HIGH').length;

  return (
    <div className="space-y-4">
      {/* Welcome Banner */}
      <div className="glass-card rounded-2xl p-4 bg-gradient-to-r from-slate-900 via-slate-900/90 to-primary/20 border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">Clinical Portal</span>
            <h2 className="text-base font-extrabold text-white">Hello, {user?.name || 'Dr. Practitioner'}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{user?.hospital || 'SmileScan Clinical Center'}</p>
          </div>
          <button
            onClick={() => navigate('/scan/new')}
            className="w-11 h-11 rounded-2xl bg-primary hover:bg-primary-hover text-white flex items-center justify-center shadow-lg shadow-primary/30 active:scale-95 transition-transform"
          >
            <Camera size={20} />
          </button>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-3 gap-2.5">
        <Card className="p-3 text-center">
          <div className="w-8 h-8 rounded-xl bg-blue-950/80 text-blue-400 mx-auto mb-1 flex items-center justify-center border border-blue-800/50">
            <Users size={16} />
          </div>
          <span className="text-base font-extrabold text-white block">{patients.length}</span>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Patients</span>
        </Card>

        <Card className="p-3 text-center">
          <div className="w-8 h-8 rounded-xl bg-rose-950/80 text-rose-400 mx-auto mb-1 flex items-center justify-center border border-rose-800/50">
            <AlertTriangle size={16} />
          </div>
          <span className="text-base font-extrabold text-rose-400 block">{highRiskCount}</span>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">High Risk</span>
        </Card>

        <Card className="p-3 text-center">
          <div className="w-8 h-8 rounded-xl bg-emerald-950/80 text-emerald-400 mx-auto mb-1 flex items-center justify-center border border-emerald-800/50">
            <Activity size={16} />
          </div>
          <span className="text-base font-extrabold text-emerald-400 block">{scans.length}</span>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">AI Scans</span>
        </Card>
      </div>

      {/* Action Trigger Card */}
      <Card className="p-4 bg-slate-900/80 border-slate-800 flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-primary" /> Tooth Image AI Pre-Validation
          </h3>
          <p className="text-[11px] text-slate-400 max-w-xs">
            Client pre-validation enforces $\ge 5\%$ minimum tooth coverage prior to AI inference.
          </p>
        </div>
        <Button size="sm" onClick={() => navigate('/scan/new')}>
          New Scan
        </Button>
      </Card>

      {/* Recent Scans Roster */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">Recent Diagnostic Vision Feed</h3>
          <button onClick={() => navigate('/reports')} className="text-xs text-primary font-semibold hover:underline">
            View All
          </button>
        </div>

        {loading ? (
          <div className="glass-card p-6 text-center text-xs text-slate-400">Loading AI scans...</div>
        ) : scans.length === 0 ? (
          <Card className="p-6 text-center space-y-2">
            <Camera className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">No tooth scan records available yet.</p>
            <Button size="sm" onClick={() => navigate('/scan/new')}>
              Capture First Scan
            </Button>
          </Card>
        ) : (
          <div className="space-y-2">
            {scans.slice(0, 3).map(s => (
              <Card key={s.id} hoverable onClick={() => navigate('/scan/result')} className="p-3">
                <div className="flex items-center gap-3">
                  <img
                    src={s.imageUrl}
                    alt={s.prediction}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-800"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-white truncate">{s.prediction}</span>
                      <Badge variant={s.severity === 'SEVERE' ? 'danger' : s.severity === 'MODERATE' ? 'warning' : 'success'}>
                        {s.severity}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>{(s.confidence * 100).toFixed(0)}% Confidence</span>
                      <span>•</span>
                      <span>{s.toothAreaPercentage?.toFixed(1)}% Tooth Area</span>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-slate-500" />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Patient Roster Shortcut */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">Active Patient Roster</h3>
          <button onClick={() => navigate('/patients')} className="text-xs text-primary font-semibold hover:underline">
            Manage Patients
          </button>
        </div>

        <div className="space-y-2">
          {patients.slice(0, 2).map(p => (
            <Card key={p.id} hoverable onClick={() => navigate(`/patients/${p.id}`)} className="p-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">{p.name}</span>
                <span className="text-[11px] text-slate-400">{p.age} yrs • {p.gender}</span>
              </div>
              <Badge variant={p.riskLevel === 'HIGH' ? 'danger' : p.riskLevel === 'MEDIUM' ? 'warning' : 'success'}>
                {p.riskLevel} RISK
              </Badge>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
