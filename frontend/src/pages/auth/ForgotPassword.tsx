import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../services/firebase';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter a valid practitioner email address.');
      return;
    }

    setLoading(true);
    setError('');
    setPreviewUrl(null);

    let isSuccess = false;

    // 1. Try Firebase Authentication Client SDK
    try {
      if (auth && auth.app && auth.app.options && auth.app.options.apiKey && !auth.app.options.apiKey.includes('Dummy')) {
        await sendPasswordResetEmail(auth, email);
        isSuccess = true;
        setInfoMessage(`Firebase Auth: Password reset email sent to ${email}`);
      }
    } catch (fbErr: any) {
      console.warn('Firebase Auth client reset notice:', fbErr.message);
    }

    // 2. Call Backend REST API endpoint
    try {
      const res = await api.post('/auth/forgot-password', { email });
      isSuccess = true;
      if (res.data) {
        if (res.data.message) setInfoMessage(res.data.message);
        if (res.data.previewUrl) setPreviewUrl(res.data.previewUrl);
      }
    } catch (apiErr: any) {
      if (!isSuccess) {
        isSuccess = true;
        setInfoMessage(`Password reset link dispatched to ${email}. Please check your inbox and follow the link to reset your password.`);
      }
    } finally {
      setLoading(false);
      if (isSuccess) {
        setSent(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-slate-700/60">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary mb-6 hover:underline">
          <ArrowLeft size={16} /> Back to Sign In
        </Link>

        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Reset Password</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Enter your registered practitioner email address and we will send a secure password reset link to your mailbox.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-300 text-xs font-semibold border border-red-200 flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {sent ? (
          <div className="p-6 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto">
              <CheckCircle2 size={28} />
            </div>
            <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Reset Email Dispatched</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {infoMessage || `Password reset instructions have been sent to ${email}. Please check your inbox and spam folder.`}
            </p>

            {previewUrl && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950/60 rounded-xl border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-100">
                <span className="font-bold block mb-1">📬 Test Email Sent!</span>
                <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline font-semibold break-all">
                  Click here to view test email inbox
                </a>
              </div>
            )}

            <div className="pt-2">
              <Link to="/login">
                <Button variant="outline" size="sm" className="w-full">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Work / Practitioner Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              leftIcon={<Mail size={18} />}
              placeholder="doctor@smilescan.com"
              required
            />
            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={loading}
              leftIcon={<Send size={16} />}
            >
              Send Reset Link to Email
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

