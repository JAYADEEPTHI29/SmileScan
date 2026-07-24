import { useState, useEffect, useCallback } from 'react';
import { Patient } from '../types/patient';
import { api } from '../services/api';
import { initialMockPatients } from '../utils/mockData';

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>(initialMockPatients);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/patients');
      if (res.data && res.data.patients) {
        setPatients(res.data.patients);
      }
    } catch (err: any) {
      console.warn('Backend API un-reachable. Using initial state mock patients.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const addPatient = async (patientData: Omit<Patient, 'id' | 'createdAt' | 'lastVisit'>) => {
    try {
      const res = await api.post('/patients', patientData);
      const newP = res.data.patient;
      setPatients(prev => [newP, ...prev]);
      return newP;
    } catch (err) {
      const newP: Patient = {
        ...patientData,
        id: `pat_${Date.now()}`,
        createdAt: new Date().toISOString(),
        lastVisit: new Date().toISOString(),
      };
      setPatients(prev => [newP, ...prev]);
      return newP;
    }
  };

  const updatePatient = async (id: string, updates: Partial<Patient>) => {
    try {
      await api.put(`/patients/${id}`, updates);
    } catch (err) {
      console.warn('Updating patient locally.');
    }
    setPatients(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deletePatient = async (id: string) => {
    try {
      await api.delete(`/patients/${id}`);
    } catch (err) {
      console.warn('Deleting patient locally.');
    }
    setPatients(prev => prev.filter(p => p.id !== id));
  };

  return {
    patients,
    loading,
    error,
    refetch: fetchPatients,
    addPatient,
    updatePatient,
    deletePatient,
  };
}
