import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Mail, Lock, User, Building, UserPlus, ArrowLeft } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useAuthContext } from '../../contexts/AuthContext';
import { useNotificationContext } from '../../contexts/NotificationContext';

export const MobileRegister: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuthContext();
  const { addNotification } = useNotificationContext();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hospital, setHospital] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setIsLoading(true);
    try {
      await register(email, password, name, hospital, 'General Dentistry', specialization);
      addNotification('Account Registered', 'Mobile doctor profile created successfully.', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      addNotification('Registration Failed', err.message || 'Registration failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center px-4 py-8 max-w-md mx-auto">
      <div className="text-center space-y-2 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-blue-400 mx-auto flex items-center justify-center shadow-lg shadow-primary/30">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-extrabold text-white">Create Mobile Practitioner Account</h1>
        <p className="text-xs text-slate-400">Join SmileScan AI Dental Vision Diagnostics Network</p>
      </div>

      <Card className="space-y-4 p-5 border-slate-800">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Full Practitioner Name</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 text-slate-500" size={16} />
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary"
                placeholder="Dr. Sarah Jenkins, DDS"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Clinical Email</label>
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

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-slate-500" size={16} />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary"
                placeholder="Minimum 6 characters"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Hospital / Dental Clinic</label>
            <div className="relative">
              <Building className="absolute left-3 top-2.5 text-slate-500" size={16} />
              <input
                type="text"
                value={hospital}
                onChange={e => setHospital(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary"
                placeholder="St. Jude Dental Center"
              />
            </div>
          </div>

          <Button type="submit" isLoading={isLoading} className="w-full py-2.5 mt-2">
            Create Doctor Account <UserPlus size={16} />
          </Button>

          <Link to="/login" className="block text-center text-xs text-slate-400 hover:text-white pt-1">
            <ArrowLeft size={12} className="inline mr-1" /> Already registered? Log In
          </Link>
        </form>
      </Card>
    </div>
  );
};
