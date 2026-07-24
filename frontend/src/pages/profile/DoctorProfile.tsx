import React, { useState } from 'react';
import { User, Building, Award, Mail, Phone, ShieldCheck, Camera, Save } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../hooks/useAuth';
import { useNotificationContext } from '../../contexts/NotificationContext';

export const DoctorProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { addNotification } = useNotificationContext();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    hospital: user?.hospital || 'St. Jude Dental & Maxillofacial Center',
    department: user?.department || 'Department of Endodontics & Radiology',
    experienceYears: user?.experienceYears || 12,
    specialization: user?.specialization || 'Endodontics & AI Diagnostics',
    photoUrl: user?.photoUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(formData);
    addNotification('Profile Updated', 'Practitioner details updated successfully.', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Doctor Profile</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Manage practitioner credentials, hospital affiliation, and clinical profile settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side Profile Card */}
        <Card className="flex flex-col items-center text-center p-6 space-y-4">
          <div className="relative group">
            <img
              src={formData.photoUrl}
              alt={formData.name}
              className="w-28 h-28 rounded-full object-cover border-4 border-primary/20 shadow-lg"
            />
            <button className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-white shadow-md hover:bg-primary-600 transition-colors">
              <Camera size={16} />
            </button>
          </div>

          <div>
            <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">{formData.name}</h2>
            <p className="text-xs text-primary font-bold uppercase tracking-wider">{user?.role} PRACTITIONER</p>
          </div>

          <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 space-y-2 text-left">
            <div className="flex items-center gap-2">
              <Building size={15} className="text-slate-400 shrink-0" />
              <span className="truncate">{formData.hospital}</span>
            </div>
            <div className="flex items-center gap-2">
              <Award size={15} className="text-slate-400 shrink-0" />
              <span>{formData.experienceYears} Years Experience</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-emerald-500 shrink-0" />
              <span>Verified Medical License #DEN-89412</span>
            </div>
          </div>
        </Card>

        {/* Right Side Form */}
        <Card className="md:col-span-2 p-6">
          <form onSubmit={handleSave} className="space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
              Personal & Professional Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Professional Name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                leftIcon={<User size={18} />}
                required
              />
              <Input
                label="Work Email"
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                leftIcon={<Mail size={18} />}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Hospital / Clinic Facility"
                value={formData.hospital}
                onChange={e => setFormData({ ...formData, hospital: e.target.value })}
                leftIcon={<Building size={18} />}
              />
              <Input
                label="Department"
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Years of Experience"
                type="number"
                value={formData.experienceYears}
                onChange={e => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
              />
              <Input
                label="Specialization"
                value={formData.specialization}
                onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                leftIcon={<Award size={18} />}
              />
            </div>

            <Input
              label="Profile Photo URL"
              value={formData.photoUrl}
              onChange={e => setFormData({ ...formData, photoUrl: e.target.value })}
            />

            <div className="pt-4 flex justify-end">
              <Button type="submit" leftIcon={<Save size={18} />}>
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
