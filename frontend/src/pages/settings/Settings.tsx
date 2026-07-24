import React, { useState } from 'react';
import { Moon, Sun, Globe, Bell, Lock, Shield, Save } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useTheme } from '../../hooks/useTheme';
import { useNotificationContext } from '../../contexts/NotificationContext';

export const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { addNotification } = useNotificationContext();

  const [language, setLanguage] = useState('English (US)');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [highRiskAlerts, setHighRiskAlerts] = useState(true);

  const [passwordState, setPasswordState] = useState({
    current: '',
    newPass: '',
    confirmPass: '',
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    addNotification('Settings Saved', 'System preferences have been saved.', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">System Settings</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Configure application theme, security rules, notification triggers, and localization
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance & Theme */}
        <Card className="space-y-4 p-6">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            {theme === 'dark' ? <Moon className="text-amber-400" size={18} /> : <Sun className="text-amber-500" size={18} />} Appearance & Dark Mode
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">Dark Mode Interface</span>
              <span className="text-xs text-slate-500">Toggle between medical dark mode and clean light theme</span>
            </div>
            <Button size="sm" variant="outline" onClick={toggleTheme}>
              {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </Button>
          </div>
        </Card>

        {/* Language & Regional */}
        <Card className="space-y-4 p-6">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="text-primary" size={18} /> Regional & Language Settings
          </h3>
          <div className="space-y-1.5 max-w-sm">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Clinical Interface Language</label>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option value="English (US)">English (US)</option>
              <option value="Spanish">Spanish (Español)</option>
              <option value="French">French (Français)</option>
              <option value="German">German (Deutsch)</option>
            </select>
          </div>
        </Card>

        {/* Notification Preferences */}
        <Card className="space-y-4 p-6">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="text-teal-500" size={18} /> Notification Preferences
          </h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between text-xs cursor-pointer">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Email Diagnostic Summary Reports</span>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={e => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-primary"
              />
            </label>
            <label className="flex items-center justify-between text-xs cursor-pointer">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Instant High-Risk Pathology Popups</span>
              <input
                type="checkbox"
                checked={highRiskAlerts}
                onChange={e => setHighRiskAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-primary"
              />
            </label>
          </div>
        </Card>

        {/* Security & Password */}
        <Card className="space-y-4 p-6">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="text-red-500" size={18} /> Security & Password Update
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Current Password"
              type="password"
              value={passwordState.current}
              onChange={e => setPasswordState({ ...passwordState, current: e.target.value })}
              placeholder="••••••••"
            />
            <Input
              label="New Password"
              type="password"
              value={passwordState.newPass}
              onChange={e => setPasswordState({ ...passwordState, newPass: e.target.value })}
              placeholder="••••••••"
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={passwordState.confirmPass}
              onChange={e => setPasswordState({ ...passwordState, confirmPass: e.target.value })}
              placeholder="••••••••"
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} leftIcon={<Save size={18} />}>
            Save All Preferences
          </Button>
        </div>
      </div>
    </div>
  );
};
