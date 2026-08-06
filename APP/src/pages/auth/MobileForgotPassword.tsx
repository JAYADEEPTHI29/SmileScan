import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { authService } from '../../services/authService';
import { useNotificationContext } from '../../contexts/NotificationContext';

export const MobileForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotificationContext();

  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      await authService.sendPasswordReset(email);
      setIsSent(true);
      addNotification('Password Reset Sent', `Password reset instructions sent to ${email}`, 'success');
    } catch (error: any) {
      addNotification('Error', error.message || 'Failed to send reset email.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center px-4 py-8 max-w-md mx-auto">
      <div className="text-center space-y-2 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-blue-400 mx-auto flex items-center justify-center shadow-lg shadow-primary/30">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-xl font-extrabold text-white">Reset Password</h1>
        <p className="text-xs text-slate-400">Enter your registered email to receive reset instructions</p>
      </div>

      <Card className="space-y-4 p-5 border-slate-800">
        {isSent ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle size={24} />
            </div>
            <h3 className="text-sm font-bold text-white">Reset Link Dispatched</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Please check your inbox at <span className="text-white font-semibold">{email}</span> to reset your password.
            </p>
            <Button onClick={() => navigate('/login')} className="w-full mt-4">
              Return to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-slate-500" size={16} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary"
                  placeholder="doctor@smilescan.com"
                />
              </div>
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full py-2.5">
              Send Reset Link <Send size={14} />
            </Button>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-white flex items-center justify-center gap-1"
            >
              <ArrowLeft size={14} /> Back to Sign In
            </button>
          </form>
        )}
      </Card>
    </div>
  );
};
