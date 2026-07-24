import { useState, useEffect, useCallback } from 'react';
import { ScanReport } from '../types/scan';
import { api } from '../services/api';
import { initialMockScans } from '../utils/mockData';

export function useScans() {
  const [scans, setScans] = useState<ScanReport[]>(initialMockScans);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchScans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/scans');
      if (res.data && res.data.scans) {
        setScans(res.data.scans);
      }
    } catch (err: any) {
      console.warn('Backend API un-reachable. Using initial state mock scans.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScans();
  }, [fetchScans]);

  const addScanReport = (report: ScanReport) => {
    setScans(prev => [report, ...prev]);
  };

  return {
    scans,
    loading,
    error,
    refetch: fetchScans,
    addScanReport,
  };
}
