export type UserRole = 'DOCTOR' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  hospital: string;
  department: string;
  experienceYears: number;
  specialization: string;
  photoUrl?: string;
  createdAt: string;
}

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

export interface DiseasePrediction {
  disease: string;
  confidence: number;
  affectedTeeth: number[];
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  recommendedTreatment: string[];
  suggestedMedicines: { name: string; dosage: string; duration: string }[];
  homeRemedies: string[];
  specialistRecommendation: string;
}

export interface ScanReport {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  imageUrl: string;
  imageType: 'X-Ray' | 'Intraoral Photo' | 'Panoramic Radiograph';
  predictions: DiseasePrediction[];
  overallSeverity: 'Low' | 'Medium' | 'High' | 'Critical';
  overallConfidence: number;
  status: 'Pending' | 'Completed' | 'Reviewed';
  notes?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  type: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled';
  notes?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}
