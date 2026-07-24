import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, Trash2, CheckCircle2, XCircle, Filter, User } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { useAppointments } from '../../hooks/useAppointments';
import { usePatients } from '../../hooks/usePatients';
import { Appointment } from '../../types/appointment';

export const AppointmentsCalendar: React.FC = () => {
  const { appointments, addAppointment, updateStatus, deleteAppointment } = useAppointments();
  const { patients } = usePatients();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientId: patients[0]?.id || '',
    date: '2026-07-25',
    time: '10:00 AM',
    type: 'Routine Hygiene & AI Scan',
    notes: '',
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetPatient = patients.find(p => p.id === formData.patientId) || patients[0];

    await addAppointment({
      patientId: targetPatient.id,
      patientName: targetPatient.fullName,
      doctorId: 'doc_101',
      doctorName: 'Dr. Sarah Jenkins, DDS',
      date: formData.date,
      time: formData.time,
      type: formData.type,
      status: 'Scheduled',
      notes: formData.notes,
    });
    setIsModalOpen(false);
  };

  const filteredAppointments = appointments.filter(a => filterStatus === 'ALL' || a.status === filterStatus);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Appointments Calendar</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Schedule, reschedule, and manage patient clinical consultation slots
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} leftIcon={<Plus size={18} />}>
          Schedule Appointment
        </Button>
      </div>

      {/* Filter Tabs */}
      <Card className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400" />
          <span className="text-xs font-semibold text-slate-500">Filter Status:</span>
          {['ALL', 'Scheduled', 'Completed', 'Cancelled'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 text-xs rounded-xl font-medium transition-all ${
                filterStatus === st
                  ? 'bg-primary text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </Card>

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAppointments.map(apt => (
          <Card key={apt.id} hoverEffect className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{apt.patientName}</h3>
                <p className="text-xs text-primary font-semibold mt-0.5">{apt.type}</p>
              </div>
              <Badge
                variant={
                  apt.status === 'Completed'
                    ? 'success'
                    : apt.status === 'Cancelled'
                    ? 'danger'
                    : 'info'
                }
              >
                {apt.status}
              </Badge>
            </div>

            <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <CalendarIcon size={14} className="text-slate-400" />
                <span>{apt.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-slate-400" />
                <span>{apt.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <User size={14} className="text-slate-400" />
                <span>Attending: {apt.doctorName}</span>
              </div>
            </div>

            {apt.notes && <p className="text-[11px] text-slate-500 italic bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-100 dark:border-slate-800">{apt.notes}</p>}

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              {apt.status === 'Scheduled' ? (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<CheckCircle2 size={14} className="text-emerald-500" />}
                    onClick={() => updateStatus(apt.id, 'Completed')}
                  >
                    Complete
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<XCircle size={14} className="text-red-500" />}
                    onClick={() => updateStatus(apt.id, 'Cancelled')}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <span className="text-xs text-slate-400 font-medium">Status Updated</span>
              )}

              <button
                onClick={() => deleteAppointment(apt.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500"
                title="Delete Slot"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Schedule Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule New Appointment">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Select Patient</label>
            <select
              value={formData.patientId}
              onChange={e => setFormData({ ...formData, patientId: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.fullName} ({p.phone})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              required
            />
            <Input
              label="Time Slot"
              value={formData.time}
              onChange={e => setFormData({ ...formData, time: e.target.value })}
              placeholder="10:00 AM"
              required
            />
          </div>

          <Input
            label="Appointment Procedure Type"
            value={formData.type}
            onChange={e => setFormData({ ...formData, type: e.target.value })}
            placeholder="Root Canal Evaluation"
            required
          />

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Notes / Symptoms</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional clinical notes..."
              className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Schedule Slot</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
