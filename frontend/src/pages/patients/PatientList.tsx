import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, Trash2, Edit3, Eye, Filter, Phone, Mail, FileText } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { usePatients } from '../../hooks/usePatients';
import { Patient } from '../../types/patient';
import { formatDate } from '../../utils/formatters';

export const PatientList: React.FC = () => {
  const { patients, addPatient, updatePatient, deletePatient } = usePatients();
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    age: 30,
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    phone: '',
    email: '',
    address: '',
    medicalHistory: '',
    dentalHistory: '',
    riskLevel: 'Low' as 'Low' | 'Medium' | 'High',
  });

  const navigate = useNavigate();

  const handleOpenAdd = () => {
    setEditingPatient(null);
    setFormData({
      fullName: '',
      age: 30,
      gender: 'Male',
      phone: '',
      email: '',
      address: '',
      medicalHistory: '',
      dentalHistory: '',
      riskLevel: 'Low',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setFormData({
      fullName: patient.fullName,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email,
      address: patient.address || '',
      medicalHistory: patient.medicalHistory.join(', '),
      dentalHistory: patient.dentalHistory.join(', '),
      riskLevel: patient.riskLevel,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const medArr = formData.medicalHistory ? formData.medicalHistory.split(',').map(s => s.trim()) : [];
    const dentArr = formData.dentalHistory ? formData.dentalHistory.split(',').map(s => s.trim()) : [];

    if (editingPatient) {
      await updatePatient(editingPatient.id, {
        fullName: formData.fullName,
        age: Number(formData.age),
        gender: formData.gender,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        medicalHistory: medArr,
        dentalHistory: dentArr,
        riskLevel: formData.riskLevel,
      });
    } else {
      await addPatient({
        fullName: formData.fullName,
        age: Number(formData.age),
        gender: formData.gender,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        medicalHistory: medArr,
        dentalHistory: dentArr,
        riskLevel: formData.riskLevel,
      });
    }
    setIsModalOpen(false);
  };

  const filteredPatients = patients.filter(p => {
    const matchesSearch =
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'ALL' || p.riskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Patient Roster</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage dental records, medical histories, and scan diagnostics
          </p>
        </div>
        <Button onClick={handleOpenAdd} leftIcon={<UserPlus size={18} />}>
          Add New Patient
        </Button>
      </div>

      {/* Filter Toolbar */}
      <Card className="flex flex-col md:flex-row items-center justify-between gap-4 p-4">
        <div className="w-full md:w-96 relative">
          <Search size={16} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient name, phone, or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={16} className="text-slate-400" />
          <span className="text-xs font-semibold text-slate-500">Risk Level:</span>
          {['ALL', 'Low', 'Medium', 'High'].map(risk => (
            <button
              key={risk}
              onClick={() => setRiskFilter(risk)}
              className={`px-3 py-1 text-xs rounded-xl font-medium transition-all ${
                riskFilter === risk
                  ? 'bg-primary text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {risk}
            </button>
          ))}
        </div>
      </Card>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPatients.map(patient => (
          <Card key={patient.id} hoverEffect className="flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{patient.fullName}</h3>
                  <p className="text-xs text-slate-500">
                    {patient.age} yrs • {patient.gender}
                  </p>
                </div>
                <Badge variant={patient.riskLevel === 'High' ? 'danger' : patient.riskLevel === 'Medium' ? 'warning' : 'success'}>
                  {patient.riskLevel} Risk
                </Badge>
              </div>

              <div className="mt-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-slate-400" />
                  <span>{patient.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-slate-400" />
                  <span className="truncate">{patient.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-slate-400" />
                  <span className="truncate">Last visit: {formatDate(patient.lastVisit)}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Eye size={14} />}
                onClick={() => navigate(`/patients/${patient.id}`)}
              >
                View Profile
              </Button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(patient)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Edit Patient"
                >
                  <Edit3 size={15} />
                </button>
                <button
                  onClick={() => deletePatient(patient.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                  title="Delete Patient"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add / Edit Patient Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPatient ? 'Edit Patient Record' : 'Register New Patient'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Full Name"
            value={formData.fullName}
            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Age"
              type="number"
              value={formData.age}
              onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
              required
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Gender</label>
              <select
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Phone Number"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <Input
            label="Home Address"
            value={formData.address}
            onChange={e => setFormData({ ...formData, address: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Medical History (comma separated)"
              value={formData.medicalHistory}
              onChange={e => setFormData({ ...formData, medicalHistory: e.target.value })}
              placeholder="Hypertension, Diabetes"
            />
            <Input
              label="Dental History"
              value={formData.dentalHistory}
              onChange={e => setFormData({ ...formData, dentalHistory: e.target.value })}
              placeholder="Crown #19, Extraction #32"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Risk Level Assessment</label>
            <select
              value={formData.riskLevel}
              onChange={e => setFormData({ ...formData, riskLevel: e.target.value as any })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Patient Record</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
