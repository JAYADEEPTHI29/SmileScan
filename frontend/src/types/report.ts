import { ScanReport } from './scan';

export interface MedicalReportData {
  report: ScanReport;
  hospitalName: string;
  hospitalAddress: string;
  doctorName: string;
  doctorSpecialization: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  generatedDate: string;
}
