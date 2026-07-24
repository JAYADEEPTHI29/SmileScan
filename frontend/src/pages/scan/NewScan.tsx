import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Image as ImageIcon, CheckCircle, AlertCircle, Scan, Sparkles } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { usePatients } from '../../hooks/usePatients';
import { aiScanService } from '../../services/aiScanService';
import { useScans } from '../../hooks/useScans';
import { useNotificationContext } from '../../contexts/NotificationContext';
import { ScanReport } from '../../types/scan';

export const NewScan: React.FC = () => {
  const { patients } = usePatients();
  const { addScanReport } = useScans();
  const { addNotification } = useNotificationContext();
  const navigate = useNavigate();

  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [imageType, setImageType] = useState<'X-Ray' | 'Intraoral Photo' | 'Panoramic Radiograph'>('X-Ray');
  const [notes, setNotes] = useState('');

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleRunAiAnalysis = async () => {
    if (!file) return;

    setIsScanning(true);
    setScanProgress(15);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 400);

    try {
      const report: ScanReport = await aiScanService.processScanImage(
        file,
        selectedPatientId || patients[0]?.id || 'pat_1',
        imageType,
        notes
      );

      const targetPatient = patients.find(p => p.id === selectedPatientId) || patients[0];
      if (targetPatient) {
        report.patientName = targetPatient.fullName;
      }

      clearInterval(interval);
      setScanProgress(100);

      setTimeout(() => {
        addScanReport(report);
        addNotification(
          'AI Vision Scan Complete',
          `Successfully analyzed radiograph for ${report.patientName}. Diagnosis: ${report.predictions[0]?.disease}`,
          'success'
        );
        setIsScanning(false);
        navigate('/scan/result', { state: { report } });
      }, 500);
    } catch (err) {
      clearInterval(interval);
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="text-primary animate-pulse" /> AI Dental Radiograph Analysis
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Upload intraoral radiographs, CBCT scans, or photos for automated deep vision clinical decision support
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload & Preview Card */}
        <Card className="md:col-span-2 space-y-4">
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
              previewUrl
                ? 'border-primary bg-primary-50/20 dark:bg-primary-950/20'
                : 'border-slate-300 dark:border-slate-700 hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            {previewUrl ? (
              <div className="space-y-4">
                <div className="relative max-h-72 rounded-xl overflow-hidden shadow-lg mx-auto">
                  <img src={previewUrl} alt="Scan Preview" className="w-full h-full object-contain bg-slate-950" />
                  {isScanning && (
                    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-white">
                      <Scan size={48} className="animate-spin text-primary mb-3" />
                      <h4 className="font-bold text-base mb-1">Deep Vision AI Neural Scan Active</h4>
                      <p className="text-xs text-slate-300 mb-3">Segmenting dental arches & evaluating enamel density...</p>
                      <div className="w-full max-w-xs h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                          style={{ width: `${scanProgress}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono font-bold mt-2">{scanProgress}%</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center gap-3">
                  <label className="text-xs font-semibold text-primary hover:underline cursor-pointer">
                    Change Image
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500">{file?.name}</span>
                </div>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-950/60 text-primary flex items-center justify-center mb-3">
                  <UploadCloud size={32} />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Drop dental X-ray or click to upload
                </h4>
                <p className="text-xs text-slate-400 mt-1">Supports PNG, JPG, WEBP, TIFF, DICOM up to 25MB</p>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            )}
          </div>

          <Button
            onClick={handleRunAiAnalysis}
            disabled={!file || isScanning}
            isLoading={isScanning}
            className="w-full"
            size="lg"
            leftIcon={<Scan size={20} />}
          >
            Execute AI Diagnostic Analysis
          </Button>
        </Card>

        {/* Scan Parameters Card */}
        <Card className="space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Clinical Parameters</h3>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Select Patient</label>
            <select
              value={selectedPatientId}
              onChange={e => setSelectedPatientId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.fullName} ({p.age} yrs - #{p.id})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Radiograph Modality</label>
            <select
              value={imageType}
              onChange={e => setImageType(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option value="X-Ray">Intraoral Bitewing / Periapical X-Ray</option>
              <option value="Intraoral Photo">Intraoral HD Photography</option>
              <option value="Panoramic Radiograph">Panoramic OPG Radiograph</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Clinical Notes (Optional)</label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Patient complains of localized sensitivity on upper right quadrant..."
              className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-primary"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};
