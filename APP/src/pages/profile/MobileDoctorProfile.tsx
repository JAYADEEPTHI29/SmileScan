import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Building, Award, ShieldCheck, LogOut, ArrowLeft, Settings } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useAuthContext } from '../../contexts/AuthContext';
import { useNotificationContext } from '../../contexts/NotificationContext';

export const MobileDoctorProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();
  const { addNotification } = useNotificationContext();

  const handleLogout = async () => {
    await logout();
    addNotification('Logged Out', 'Logged out of mobile practitioner portal.', 'info');
    navigate('/login');
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
        <button onClick={() => navigate('/settings')} className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
          <Settings size={16} />
        </button>
      </div>

      {/* Practitioner Card */}
      <Card className="p-4 text-center space-y-3 border-slate-800">
        <img
          src={user?.photoUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400'}
          alt={user?.name}
          className="w-20 h-20 rounded-2xl object-cover mx-auto border-2 border-primary shadow-xl"
        />
        <div>
          <h2 className="text-base font-extrabold text-white">{user?.name || 'Dr. Practitioner, DDS'}</h2>
          <p className="text-xs text-primary font-bold mt-0.5">{user?.specialization || 'General Dentistry & AI Diagnostics'}</p>
          <p className="text-[11px] text-slate-400 mt-1">{user?.email}</p>
        </div>
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-[11px] font-bold">
          <ShieldCheck size={14} /> Verified Dental Vision Practitioner
        </div>
      </Card>

      {/* Credentials Detail */}
      <Card className="p-4 space-y-2.5 text-xs">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">Clinical Profile</h3>

        <div className="flex items-center gap-2.5 py-1 border-b border-slate-800/80">
          <Building size={16} className="text-slate-500 shrink-0" />
          <div>
            <span className="text-slate-400 block text-[10px]">Affiliated Hospital / Clinic:</span>
            <span className="text-white font-bold">{user?.hospital || 'SmileScan Clinical Center'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 py-1 border-b border-slate-800/80">
          <Award size={16} className="text-slate-500 shrink-0" />
          <div>
            <span className="text-slate-400 block text-[10px]">Clinical Experience:</span>
            <span className="text-white font-bold">{user?.experienceYears || 5} Years Practitioner</span>
          </div>
        </div>
      </Card>

      <Button variant="danger" onClick={handleLogout} className="w-full py-3">
        Sign Out <LogOut size={16} />
      </Button>
    </div>
  );
};
