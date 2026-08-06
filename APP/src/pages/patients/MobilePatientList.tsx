import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, ArrowLeft, Filter } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { patientService } from '../../services/patientService';
import { useNotificationContext } from '../../contexts/NotificationContext';
import { Patient } from '../../types';

export const MobilePatientList: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotificationContext();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  // New Patient Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [riskLevel, setRiskLevel] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('LOW');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadPatients();
  }, []);

  async function loadPatients() {
    try {
      const data = await patientService.getPatients();
      setPatients(data);
    } catch (err) {
      console.warn('Patient fetch error:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age) return;

    setIsSaving(true);
    try {
      const created = await patientService.createPatient({
        name,
        age: parseInt(age, 10),
        gender,
        phone,
        email,
        riskLevel,
        systemicConditions: [],
        notes
      });
      setPatients(prev => [created, ...prev]);
      addNotification('Patient Created', `${created.name} added to clinical database.`, 'success');
      setIsModalOpen(false);
      setName('');
      setAge('');
      setPhone('');
      setEmail('');
      setNotes('');
    } catch (err: any) {
      addNotification('Error', 'Failed to create patient record.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const filtered = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.includes(searchTerm);
    const matchesRisk = riskFilter === 'ALL' || p.riskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white"
        >
          <ArrowLeft size={16} /> Dashboard
        </button>
        <Button size="sm" onClick={() => setIsModalOpen(true)}>
          <UserPlus size={14} /> Add Patient
        </Button>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search patients by name or ID..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map(r => (
            <button
              key={r}
              onClick={() => setRiskFilter(r)}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold border transition-colors ${
                riskFilter === r
                  ? 'bg-primary text-white border-primary'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {r} RISK
            </button>
          ))}
        </div>
      </div>

      {/* Patient Cards Roster */}
      {loading ? (
        <div className="glass-card p-6 text-center text-xs text-slate-400">Loading patients...</div>
      ) : filtered.length === 0 ? (
        <Card className="p-6 text-center text-xs text-slate-400">No matching patient records found.</Card>
      ) : (
        <div className="space-y-2">
          {filtered.map(p => (
            <Card
              key={p.id}
              hoverable
              onClick={() => navigate(`/patients/${p.id}`)}
              className="p-3 flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">{p.name}</span>
                <span className="text-[11px] text-slate-400 block">{p.age} yrs • {p.gender} • {p.phone || 'No phone'}</span>
                {p.notes && <span className="text-[10px] text-slate-500 line-clamp-1">{p.notes}</span>}
              </div>
              <Badge variant={p.riskLevel === 'HIGH' ? 'danger' : p.riskLevel === 'MEDIUM' ? 'warning' : 'success'}>
                {p.riskLevel}
              </Badge>
            </Card>
          ))}
        </div>
      )}

      {/* Modal for Adding New Patient */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Patient Record">
        <form onSubmit={handleAddPatient} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary"
              placeholder="Patient Full Name"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Age</label>
              <input
                type="number"
                required
                value={age}
                onChange={e => setAge(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary"
                placeholder="30"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Gender</label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Risk Assessment</label>
            <select
              value={riskLevel}
              onChange={e => setRiskLevel(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
            >
              <option value="LOW">Low Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="HIGH">High Risk</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Clinical Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary h-16 resize-none"
              placeholder="Initial clinical observations..."
            />
          </div>

          <Button type="submit" isLoading={isSaving} className="w-full py-2.5 mt-2">
            Save Patient Record
          </Button>
        </form>
      </Modal>
    </div>
  );
};
