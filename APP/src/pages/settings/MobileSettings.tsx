import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, Sun, Moon, Database, ArrowLeft, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useThemeContext } from '../../contexts/ThemeContext';
import { useNotificationContext } from '../../contexts/NotificationContext';
import { db, auth } from '../../firebase/firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';

export const MobileSettings: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeContext();
  const { addNotification } = useNotificationContext();

  const [aiAutoScan, setAiAutoScan] = useState(true);
  const [offlineSync, setOfflineSync] = useState(true);
  const [isTestingFirebase, setIsTestingFirebase] = useState(false);
  const [firebaseStatus, setFirebaseStatus] = useState<{ connected: boolean; message: string } | null>(null);

  const handleSaveSettings = () => {
    addNotification('Settings Saved', 'Mobile app preferences updated.', 'success');
  };

  const handleTestFirebase = async () => {
    setIsTestingFirebase(true);
    setFirebaseStatus(null);
    try {
      // Query Firestore collection to verify live connection to smile-scan-d6681
      const snap = await getDocs(query(collection(db, 'Doctors'), limit(1)));
      const authUser = auth.currentUser;
      setFirebaseStatus({
        connected: true,
        message: `Firebase Live & Active (Project: smile-scan-d6681). Auth user: ${authUser ? authUser.email : 'Guest / Ready'}`
      });
      addNotification('Firebase Connected', 'Successfully communicated with Firebase project smile-scan-d6681.', 'success');
    } catch (err: any) {
      setFirebaseStatus({
        connected: false,
        message: `Firebase Connection Notice: ${err?.message || 'Check network / credentials'}`
      });
      addNotification('Firebase Connection Notice', err?.message || 'Could not verify Firebase connection.', 'warning');
    } finally {
      setIsTestingFirebase(false);
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
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mobile Settings</span>
      </div>

      {/* Preferences Section */}
      <Card className="p-4 space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">App Preferences</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-1 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-white block">Appearance Mode</span>
              <span className="text-[10px] text-slate-400">Switch dark & light mobile interface</span>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
            >
              {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-blue-400" />}
            </button>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-white block">Auto AI Pre-Validation</span>
              <span className="text-[10px] text-slate-400">Enforce tooth image pre-filtering prior to inference</span>
            </div>
            <input
              type="checkbox"
              checked={aiAutoScan}
              onChange={e => setAiAutoScan(e.target.checked)}
              className="w-4 h-4 rounded accent-primary cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-white block">Offline Scan Sync</span>
              <span className="text-[10px] text-slate-400">Save scan reports locally when offline</span>
            </div>
            <input
              type="checkbox"
              checked={offlineSync}
              onChange={e => setOfflineSync(e.target.checked)}
              className="w-4 h-4 rounded accent-primary cursor-pointer"
            />
          </div>
        </div>
      </Card>

      {/* Backend & Firebase Config Card */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white flex items-center gap-2">
            <Database size={16} className="text-primary" /> Firebase Database Status
          </h3>
          <button
            onClick={handleTestFirebase}
            disabled={isTestingFirebase}
            className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-[11px] font-bold flex items-center gap-1 hover:bg-primary/20"
          >
            <RefreshCw size={12} className={isTestingFirebase ? 'animate-spin' : ''} />
            Test Live Status
          </button>
        </div>

        <p className="text-[11px] text-slate-400">
          Connected to shared web Firebase project <span className="text-white font-bold">smile-scan-d6681</span> (Auth, Firestore, Storage) and AI server.
        </p>

        {firebaseStatus && (
          <div
            className={`p-3 rounded-xl text-xs border flex items-center gap-2 ${
              firebaseStatus.connected
                ? 'bg-emerald-950/80 border-emerald-800 text-emerald-200'
                : 'bg-amber-950/80 border-amber-800 text-amber-200'
            }`}
          >
            {firebaseStatus.connected ? (
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle size={16} className="text-amber-400 shrink-0" />
            )}
            <span className="text-[11px] font-medium leading-tight">{firebaseStatus.message}</span>
          </div>
        )}
      </Card>

      <Button onClick={handleSaveSettings} className="w-full py-3">
        Save Mobile Preferences
      </Button>
    </div>
  );
};
