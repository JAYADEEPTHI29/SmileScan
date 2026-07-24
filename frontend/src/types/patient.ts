export interface Patient {
  id: string;
  fullName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address?: string;
  medicalHistory: string[];
  dentalHistory: string[];
  createdAt: string;
  lastVisit: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}
