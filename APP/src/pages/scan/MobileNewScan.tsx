import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, ShieldCheck, AlertCircle, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { validateToothImage, ValidationResult } from '../../utils/toothValidator';
import { patientService } from '../../services/patientService';
import { aiScanService } from '../../services/aiScanService';
import { useScanContext } from '../../contexts/ScanContext';
import { useNotificationContext } from '../../contexts/NotificationContext';
import { Patient } from '../../types';

export const MobileNewScan: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentScan } = useScanContext();
  const { addNotification } = useNotificationContext();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isValidating, setIsValidating] = useState(false);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    patientService.getPatients().then(list => {
      setPatients(list);
      if (list.length > 0) setSelectedPatientId(list[0].id);
    });
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
    setValidation(null);

    setIsValidating(true);
    try {
      const result = await validateToothImage(file);
      setValidation(result);
      if (!result.isValid) {
        addNotification('Non-Dental Image Rejected', result.reason || 'Non-Dental Image Detected: AI scan aborted.', 'error');
      } else {
        addNotification('Tooth Pre-Validation Passed', `Tooth area: ${result.toothAreaPercentage.toFixed(1)}%. Ready for AI scan.`, 'success');
      }
    } catch (err) {
      console.warn('Pre-validation error:', err);
    } finally {
      setIsValidating(false);
    }
  };

  const handleStartScan = async () => {
    if (!selectedFile || !selectedPatientId) return;

    // Strict pre-scan validation check
    setIsValidating(true);
    const checkResult = await validateToothImage(selectedFile);
    setValidation(checkResult);
    setIsValidating(false);

    if (!checkResult.isValid) {
      addNotification(
        'Non-Dental Image Detected',
        checkResult.reason || 'The uploaded file does not contain a tooth. AI scanning aborted.',
        'error'
      );
      return; // CRITICAL: REJECT & DO NOT GO TO SCAN RESULTS
    }

    setIsProcessing(true);
    setProgress(15);

    const interval = setInterval(() => {
      setProgress(p => (p >= 90 ? 90 : p + 15));
    }, 400);

    try {
      const resultScan = await aiScanService.submitScan(selectedFile, selectedPatientId);
      clearInterval(interval);
      setProgress(100);

      setCurrentScan(resultScan);
      addNotification('AI Diagnosis Complete', 'Dental vision analysis successfully performed.', 'success');
      setTimeout(() => {
        navigate('/scan/result');
      }, 500);
    } catch (err: any) {
      clearInterval(interval);
      setIsProcessing(false);
      addNotification('Scan Aborted', err.message || 'Failed to complete AI scan.', 'error');
    }
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
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mobile Tooth Scanner</span>
      </div>

      {/* Patient Selection */}
      <Card className="p-3.5 space-y-1.5">
        <label className="text-xs font-bold text-slate-300 block">Select Patient Record</label>
        <select
          value={selectedPatientId}
          onChange={e => setSelectedPatientId(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
        >
          {patients.map(p => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.age} yrs • {p.riskLevel} Risk)
            </option>
          ))}
        </select>
      </Card>

      {/* Loading Overlay while validating */}
      {isValidating && (
        <Card className="p-5 text-center space-y-3 bg-slate-900 border-slate-800">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="text-sm font-bold text-white">Validating Dental Image...</div>
          <div className="text-xs text-slate-400">Running pre-scan AI validation...</div>
        </Card>
      )}

      {/* Invalid Image Page Design (Requirement #5) */}
      {validation && !validation.isValid && !isValidating && (
        <div className="p-6 rounded-2xl bg-[#FFEAEA] border border-red-200 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-red-100 border border-red-200 mx-auto flex items-center justify-center text-red-600">
            <AlertCircle size={36} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-red-900 flex items-center justify-center gap-1.5">
              ❌ Invalid Image
            </h2>
            <p className="text-xs font-medium text-red-800 mt-2 leading-relaxed whitespace-pre-line">
              The uploaded image is not a valid tooth or oral cavity image.
              {"\n\n"}
              Please upload a clear image containing only teeth or the inside of the mouth.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <label className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#0066CC] hover:bg-blue-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-md">
              <Upload size={14} /> Upload Another Image
              <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            </label>

            <label className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#0066CC] hover:bg-blue-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-md">
              <Camera size={14} /> Open Camera
              <input type="file" accept="image/*" capture="environment" onChange={handleFileSelect} className="hidden" />
            </label>
          </div>
        </div>
      )}

      {/* Image Uploader */}
      {(!validation || validation.isValid) && (
        <Card className="p-4 text-center border-dashed border-slate-800 space-y-3">
          {imagePreview ? (
            <div className="space-y-3">
              <img
                src={imagePreview}
                alt="Tooth preview"
                className="max-h-56 w-full object-contain rounded-xl border border-slate-800 bg-slate-950"
              />
              {validation && validation.isValid && (
                <div className="p-3 rounded-xl text-xs border text-left bg-emerald-950/80 border-emerald-800/80 text-emerald-200">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    Pre-Validation Passed (Confidence &gt; 90%)
                  </div>
                  <div className="text-[11px] opacity-90 mt-1">
                    Dental Image Verified. Ready for SmileScan AI Vision diagnostic analysis.
                  </div>
                </div>
              )}
              <label className="inline-flex items-center gap-1.5 text-xs text-primary font-bold cursor-pointer hover:underline">
                <Upload size={14} /> Choose Different Image
                <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              </label>
            </div>
          ) : (
            <label className="block py-8 cursor-pointer space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 mx-auto flex items-center justify-center text-primary shadow-lg shadow-primary/10">
                <Upload size={26} />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Upload Tooth Photo from Device Gallery</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Select X-Ray, intraoral photo, or tooth image
                </span>
              </div>
              <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            </label>
          )}
        </Card>
      )}

      {/* Progress */}
      {isProcessing && (
        <Card className="p-4 space-y-2 text-center">
          <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
            <span>Running SmileScan AI Vision Diagnostic Engine...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </Card>
      )}

      <Button
        onClick={handleStartScan}
        disabled={!selectedFile || (validation !== null && !validation.isValid) || isProcessing || isValidating}
        isLoading={isProcessing}
        className="w-full py-3 text-sm bg-[#0066CC]"
      >
        Execute AI Diagnostic Scan
      </Button>
    </div>
  );
};
