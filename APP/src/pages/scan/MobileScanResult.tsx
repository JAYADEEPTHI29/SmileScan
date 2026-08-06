import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, AlertTriangle, Pill, HeartPulse, FileText, CheckCircle, Share2 } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useScanContext } from '../../contexts/ScanContext';
import { useNotificationContext } from '../../contexts/NotificationContext';

export const MobileScanResult: React.FC = () => {
  const navigate = useNavigate();
  const { currentScan } = useScanContext();
  const { addNotification } = useNotificationContext();

  const [activeTab, setActiveTab] = useState<'verdict' | 'teeth' | 'treatment' | 'medicines'>('verdict');

  // FDI Permanent 32 Dental Teeth grid definition
  const upperTeeth = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
  const lowerTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

  const scan = currentScan || {
    id: 'scan_demo',
    patientId: 'pat_1',
    patientName: 'Eleanor Vance',
    imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=600',
    prediction: 'Class II Dental Caries & Deep Fissure Pathology',
    confidence: 0.95,
    severity: 'MODERATE' as const,
    toothAreaPercentage: 48.6,
    affectedTeeth: [16, 26, 36, 46],
    recommendations: [
      'Composite resin restoration on lower left molar 36.',
      'Topical fluoride varnish application for enamel remineralization.',
      'Bitewing radiograph follow-up in 3 months.'
    ],
    suggestedMedicines: [
      { name: 'Amoxicillin 500mg', dosage: '1 capsule 3 times daily', duration: '7 days' },
      { name: 'Ibuprofen 400mg', dosage: '1 tablet as needed for pain', duration: '5 days' },
      { name: '0.12% Chlorhexidine Rinse', dosage: '15ml twice daily', duration: '14 days' }
    ],
    homeRemedies: [
      'Warm saltwater rinses after meals',
      'Use high-fluoride toothpaste with soft toothbrush',
      'Avoid sugary foods and carbonated drinks'
    ],
    referralRecommended: false,
    createdAt: new Date().toISOString()
  };

  const isNonDental = scan.isToothImage === false || scan.prediction.toLowerCase().includes('non-dental') || scan.severity === 'NOT_AVAILABLE';

  const handleExportPDF = () => {
    addNotification('Report Exported', 'Clinical diagnostic report downloaded as PDF.', 'success');
  };

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
        <Button size="sm" variant="outline" onClick={handleExportPDF}>
          <FileText size={14} /> PDF Report
        </Button>
      </div>

      {/* Non-Dental Alert Banner */}
      {isNonDental && (
        <Card className="p-3.5 bg-rose-950/90 border-rose-800 text-rose-200 space-y-1">
          <div className="flex items-center gap-2 font-bold text-sm text-white">
            <AlertTriangle size={18} className="text-rose-400 shrink-0" />
            <span>Non-Dental Image Detected</span>
          </div>
          <p className="text-xs text-rose-200/90 leading-relaxed">
            The uploaded image does not contain valid dental anatomy. Diagnostic findings, severity, and treatments are <strong>Not Available</strong>.
          </p>
        </Card>
      )}

      {/* Main Image & AI Overlay Card */}
      <Card className="p-3 space-y-2 border-slate-800">
        <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
          <img src={scan.imageUrl} alt={scan.prediction} className="w-full h-48 object-cover" />
          <div className="absolute top-2 right-2">
            {isNonDental ? (
              <Badge variant="danger">NON-DENTAL IMAGE</Badge>
            ) : (
              <Badge variant={scan.severity === 'SEVERE' ? 'danger' : scan.severity === 'MODERATE' ? 'warning' : 'success'}>
                {scan.severity} SEVERITY
              </Badge>
            )}
          </div>
          <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] text-slate-300 font-bold border border-slate-800">
            Tooth Coverage: {isNonDental ? 'Not Available' : `${scan.toothAreaPercentage?.toFixed(1)}%`}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-extrabold text-white">
            {isNonDental ? 'Non-Dental Image Detected' : scan.prediction}
          </h2>
          <div className="flex items-center justify-between mt-1 text-xs text-slate-400 font-semibold">
            <span>AI Confidence Score:</span>
            <span className={isNonDental ? 'text-slate-500 font-bold' : 'text-primary font-bold'}>
              {isNonDental ? 'Not Available' : `${(scan.confidence * 100).toFixed(1)}%`}
            </span>
          </div>
        </div>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-around bg-slate-900/80 p-1 rounded-xl border border-slate-800">
        {[
          { id: 'verdict', label: 'Verdict' },
          { id: 'teeth', label: '32 Teeth Map' },
          { id: 'treatment', label: 'Treatment' },
          { id: 'medicines', label: 'Medicines' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition-colors ${
              activeTab === t.id ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Verdict Details */}
      {activeTab === 'verdict' && (
        <Card className="p-4 space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">Diagnostic Verdict & Risk Profile</h3>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-slate-400 font-semibold block mb-0.5">Primary Finding:</span>
              <span className="text-white font-bold">{isNonDental ? 'Non-Dental Image (Not Available)' : scan.prediction}</span>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-slate-400 font-semibold block mb-0.5">Calculated Severity Level:</span>
              <span className="text-white font-bold">{isNonDental ? 'Not Available' : scan.severity}</span>
            </div>
            {scan.referralRecommended && !isNonDental && (
              <div className="p-3 bg-rose-950/60 rounded-xl border border-rose-800/80 text-rose-200 flex items-center gap-2">
                <AlertTriangle size={18} className="text-rose-400 shrink-0" />
                <span>Specialist Referral Recommended for Advanced Endodontic Evaluation.</span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Tab 2: 32 Permanent FDI Dental Map */}
      {activeTab === 'teeth' && (
        <Card className="p-4 space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400 text-center">
            32 Permanent FDI Dental Chart
          </h3>

          {isNonDental ? (
            <div className="p-6 text-center text-xs text-slate-400 font-semibold bg-slate-900/40 rounded-xl border border-slate-800">
              Not Available: Tooth identification requires a valid dental radiograph or intraoral photo.
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1 text-center">Upper Arch (Maxillary)</span>
                <div className="grid grid-cols-8 gap-1">
                  {upperTeeth.map(t => {
                    const isAffected = scan.affectedTeeth?.includes(t);
                    return (
                      <div
                        key={t}
                        className={`p-1.5 rounded-lg text-center font-bold text-[10px] border transition-colors ${
                          isAffected
                            ? 'bg-rose-950 text-rose-300 border-rose-700 shadow-md shadow-rose-900/40'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        {t}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1 text-center">Lower Arch (Mandibular)</span>
                <div className="grid grid-cols-8 gap-1">
                  {lowerTeeth.map(t => {
                    const isAffected = scan.affectedTeeth?.includes(t);
                    return (
                      <div
                        key={t}
                        className={`p-1.5 rounded-lg text-center font-bold text-[10px] border transition-colors ${
                          isAffected
                            ? 'bg-rose-950 text-rose-300 border-rose-700 shadow-md shadow-rose-900/40'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        {t}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Tab 3: Recommended Procedures */}
      {activeTab === 'treatment' && (
        <Card className="p-4 space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">Clinical Treatment Plan</h3>
          {isNonDental ? (
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-rose-300 font-semibold">
              Not Available: No treatment plan can be generated for non-dental images.
            </div>
          ) : (
            <div className="space-y-2">
              {scan.recommendations?.map((rec, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-300">
                  <CheckCircle size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Tab 4: Suggested Medicines & Home Care */}
      {activeTab === 'medicines' && (
        <Card className="p-4 space-y-4">
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Pill size={16} className="text-primary" /> Prescribed Medicines
            </h3>
            {isNonDental ? (
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-rose-300 font-semibold">
                Not Available: Prescriptions require a valid dental radiograph diagnosis.
              </div>
            ) : (
              <div className="space-y-2">
                {scan.suggestedMedicines?.map((med, i) => (
                  <div key={i} className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 text-xs">
                    <span className="font-bold text-white block">{med.name}</span>
                    <span className="text-[11px] text-slate-400 block">{med.dosage} • {med.duration}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <HeartPulse size={16} className="text-emerald-400" /> Home Care & Remedies
            </h3>
            {isNonDental ? (
              <div className="text-xs text-slate-400">
                Not Available for non-dental media. Please re-scan with a clear dental image.
              </div>
            ) : (
              <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                {scan.homeRemedies?.map((rem, i) => (
                  <li key={i}>{rem}</li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
