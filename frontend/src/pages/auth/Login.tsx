import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, LogIn, CheckCircle2 } from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('doctor@smilescan.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      // Demo authentication fallback
      const role = email.includes('admin') ? 'ADMIN' : 'DOCTOR';
      login('smilescan_demo_jwt_2026', {
        id: `usr_${Date.now()}`,
        email,
        name: role === 'ADMIN' ? 'Dr. Marcus Vance (Admin)' : 'Dr. Sarah Jenkins, DDS',
        role,
        hospital: 'St. Jude Dental & Maxillofacial Center',
        department: 'Endodontics & AI Diagnostics',
        experienceYears: 12,
        specialization: 'Endodontics',
        photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
        createdAt: new Date().toISOString(),
      });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-slate-700/60">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-lg shadow-primary/30 mb-3">
            <Activity size={32} className="animate-pulse" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Smile<span className="text-primary">Scan</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            AI Dental Clinical Decision Support System
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-300 text-xs font-semibold border border-red-200">
            {error}
          </div>
        )}

        {/* Demo Fast Login Banner */}
        <div className="mb-6 p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800 text-xs text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-2 font-bold text-primary mb-1">
            <CheckCircle2 size={16} />
            <span>Instant Demo Access</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Click <b>Sign In</b> directly to explore Doctor portal, or enter an email with &apos;admin&apos; for Admin mode.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Doctor / Practitioner Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            leftIcon={<Mail size={18} />}
            placeholder="doctor@smilescan.com"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            leftIcon={<Lock size={18} />}
            placeholder="••••••••"
            required
          />

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-slate-300 text-primary focus:ring-primary" />
              Remember Me
            </label>
            <Link to="/forgot-password" className="text-primary font-semibold hover:underline">
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full mt-2"
            size="lg"
            isLoading={loading}
            leftIcon={<LogIn size={18} />}
          >
            Sign In to Clinical System
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          New practitioner?{' '}
          <Link to="/register" className="text-primary font-bold hover:underline">
            Register Clinical Account
          </Link>
        </div>
      </div>
    </div>
  );
};
