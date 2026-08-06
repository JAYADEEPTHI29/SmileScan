import React, { createContext, useContext, useState } from 'react';
import { Scan } from '../types';

interface ScanContextType {
  currentScan: Scan | null;
  setCurrentScan: (scan: Scan | null) => void;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

export const ScanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScan, setCurrentScan] = useState<Scan | null>(null);

  return (
    <ScanContext.Provider value={{ currentScan, setCurrentScan }}>
      {children}
    </ScanContext.Provider>
  );
};

export const useScanContext = () => {
  const context = useContext(ScanContext);
  if (!context) throw new Error('useScanContext must be used within ScanProvider');
  return context;
};
