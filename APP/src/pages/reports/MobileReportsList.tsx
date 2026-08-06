import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft, Search } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { aiScanService } from '../../services/aiScanService';
import { Scan } from '../../types';

export const MobileReportsList: React.FC = () => {
  const navigate = useNavigate();
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    aiScanService.getScanHistory().then(list => {
      setScans(list);
      setLoading(false);
    });
  }, []);

  const filtered = scans.filter(s =>
    (s.patientName || '').toLowerCase().includes(search.toLowerCase()) ||
    s.prediction.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white"
        >
          <ArrowLeft size={16} /> Home
        </button>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Diagnostic Reports</span>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search diagnostic reports..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary"
        />
      </div>

      {/* Reports List */}
      {loading ? (
        <div className="glass-card p-6 text-center text-xs text-slate-400">Loading reports...</div>
      ) : filtered.length === 0 ? (
        <Card className="p-6 text-center text-xs text-slate-400">No diagnostic reports found.</Card>
      ) : (
        <div className="space-y-2">
          {filtered.map(s => (
            <Card key={s.id} hoverable onClick={() => navigate('/scan/result')} className="p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-800/60 text-primary flex items-center justify-center shrink-0">
                <FileText size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-bold text-white truncate">{s.prediction}</span>
                  <Badge variant={s.severity === 'SEVERE' ? 'danger' : s.severity === 'MODERATE' ? 'warning' : 'success'}>
                    {s.severity}
                  </Badge>
                </div>
                <div className="text-[11px] text-slate-400">
                  {s.patientName || 'Patient Scan'} • {(s.confidence * 100).toFixed(0)}% Confidence
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
