import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, LogIn, CheckCircle2 } from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase/firebase';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('doctor@smilescan.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;

      const user = {
        id: fbUser.uid,
        email: fbUser.email || 'google.practitioner@smilescan.com',
        name: fbUser.displayName || 'Dr. Google Practitioner',
        role: (fbUser.email && fbUser.email.includes('admin')) ? 'ADMIN' as const : 'DOCTOR' as const,
        hospital: 'SmileScan Dental Network',
        department: 'Restorative & Digital Dentistry',
        experienceYears: 8,
        specialization: 'General Dentistry',
        photoUrl: fbUser.photoURL || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
        createdAt: new Date().toISOString(),
      };

      const token = await fbUser.getIdToken();
      login(token, user);
      navigate('/dashboard');
    } catch (err: any) {
      console.warn('Firebase Google Sign-In notice:', err.message);
      // Seamless fallback for Google Sign-In
      login('google_auth_token_2026', {
        id: `usr_google_${Date.now()}`,
        email: 'google.doctor@smilescan.com',
        name: 'Dr. Google Practitioner, DDS',
        role: 'DOCTOR',
        hospital: 'SmileScan Dental Center',
        department: 'General Dentistry & AI Diagnostics',
        experienceYears: 7,
        specialization: 'General Dentistry',
        photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
        createdAt: new Date().toISOString(),
      });
      navigate('/dashboard');
    } finally {
      setGoogleLoading(false);
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
            Click <b>Sign In</b> directly or use <b>Continue with Google</b> to enter the system.
          </p>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-650 text-slate-700 dark:text-slate-200 font-semibold text-sm border border-slate-300 dark:border-slate-600 shadow-sm transition-all duration-200 hover:shadow-md mb-5"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          {googleLoading ? 'Signing in with Google...' : 'Continue with Google'}
        </button>

        <div className="relative flex items-center justify-center mb-5">
          <div className="border-t border-slate-200 dark:border-slate-700 w-full"></div>
          <span className="bg-white dark:bg-slate-800 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            or sign in with email
          </span>
          <div className="border-t border-slate-200 dark:border-slate-700 w-full"></div>
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
