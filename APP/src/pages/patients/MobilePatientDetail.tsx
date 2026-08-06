import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Phone, Mail, Calendar, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { patientService } from '../../services/patientService';
import { aiScanService } from '../../services/aiScanService';
import { Patient, Scan } from '../../types';

export const MobilePatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      if (!id) return;
      try {
        const pData = await patientService.getPatientById(id);
        setPatient(pData);

        const sList = await aiScanService.getScanHistory();
        setScans(sList.filter(s => s.patientId === id || s.patientName === pData?.name));
      } catch (err) {
        console.warn('Error loading patient details:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [id]);

  if (loading) {
    return <div className="glass-card p-6 text-center text-xs text-slate-400">Loading patient profile...</div>;
  }

  if (!patient) {
    return (
      <Card className="p-6 text-center space-y-3">
        <p className="text-xs text-slate-400">Selected patient record not found in database.</p>
        <Button size="sm" onClick={() => navigate('/patients')}>
          Back to Roster
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/patients')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white"
        >
          <ArrowLeft size={16} /> Patient Roster
        </button>
        <Button size="sm" onClick={() => navigate('/scan/new')}>
          <Camera size={14} /> New Scan
        </Button>
      </div>

      {/* Profile Card */}
      <Card className="p-4 space-y-3 border-slate-800">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-extrabold text-white">{patient.name}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{patient.age} yrs • {patient.gender}</p>
          </div>
          <Badge variant={patient.riskLevel === 'HIGH' ? 'danger' : patient.riskLevel === 'MEDIUM' ? 'warning' : 'success'}>
            {patient.riskLevel} RISK
          </Badge>
        </div>

        <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
          {patient.phone && (
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-slate-500" /> {patient.phone}
            </div>
          )}
          {patient.email && (
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-slate-500" /> {patient.email}
            </div>
          )}
          {patient.notes && (
            <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 mt-1">
              <span className="font-bold text-slate-300 block mb-0.5">Clinical Notes:</span>
              {patient.notes}
            </div>
          )}
        </div>
      </Card>

      {/* Systemic Conditions */}
      {patient.systemicConditions && patient.systemicConditions.length > 0 && (
        <Card className="p-3 space-y-1.5">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">Systemic & Medical Conditions</h3>
          <div className="flex flex-wrap gap-1.5">
            {patient.systemicConditions.map((cond, i) => (
              <Badge key={i} variant="warning">
                {cond}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Patient Scan History Roster */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">AI Diagnostic Scan Timeline</h3>
        {scans.length === 0 ? (
          <Card className="p-4 text-center text-xs text-slate-400">
            No diagnostic scans recorded for this patient.
          </Card>
        ) : (
          <div className="space-y-2">
            {scans.map(s => (
              <Card key={s.id} hoverable onClick={() => navigate('/scan/result')} className="p-3 flex items-center gap-3">
                <img src={s.imageUrl} alt={s.prediction} className="w-12 h-12 rounded-xl object-cover border border-slate-800" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold text-white truncate">{s.prediction}</span>
                    <Badge variant={s.severity === 'SEVERE' ? 'danger' : s.severity === 'MODERATE' ? 'warning' : 'success'}>
                      {s.severity}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {(s.confidence * 100).toFixed(0)}% Confidence • {s.toothAreaPercentage?.toFixed(1)}% Tooth Area
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
