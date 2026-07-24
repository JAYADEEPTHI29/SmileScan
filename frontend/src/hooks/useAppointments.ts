import { useState, useEffect, useCallback } from 'react';
import { Appointment } from '../types/appointment';
import { api } from '../services/api';
import { initialMockAppointments } from '../utils/mockData';

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(initialMockAppointments);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/appointments');
      if (res.data && res.data.appointments) {
        setAppointments(res.data.appointments);
      }
    } catch (err: any) {
      console.warn('Backend API un-reachable. Using initial state mock appointments.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const addAppointment = async (apt: Omit<Appointment, 'id' | 'createdAt'>) => {
    try {
      const res = await api.post('/appointments', apt);
      const newA = res.data.appointment;
      setAppointments(prev => [...prev, newA]);
      return newA;
    } catch (err) {
      const newA: Appointment = {
        ...apt,
        id: `apt_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setAppointments(prev => [...prev, newA]);
      return newA;
    }
  };

  const updateStatus = async (id: string, status: Appointment['status']) => {
    try {
      await api.patch(`/appointments/${id}/status`, { status });
    } catch (err) {
      console.warn('Updating appointment status locally.');
    }
    setAppointments(prev => prev.map(a => (a.id === id ? { ...a, status } : a)));
  };

  const deleteAppointment = async (id: string) => {
    try {
      await api.delete(`/appointments/${id}`);
    } catch (err) {
      console.warn('Deleting appointment locally.');
    }
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  return {
    appointments,
    loading,
    error,
    refetch: fetchAppointments,
    addAppointment,
    updateStatus,
    deleteAppointment,
  };
}
