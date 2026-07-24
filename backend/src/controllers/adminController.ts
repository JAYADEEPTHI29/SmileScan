import { Request, Response } from 'express';
import { FirebaseService } from '../services/firebaseService';

export const adminController = {
  async getDashboardAnalytics(req: Request, res: Response) {
    try {
      const users = await FirebaseService.getAllUsers();
      const patients = await FirebaseService.getPatients();
      const scans = await FirebaseService.getScans();
      const appointments = await FirebaseService.getAppointments();
      const auditLogs = await FirebaseService.getAuditLogs();

      const doctors = users.filter(u => u.role === 'DOCTOR');

      const analytics = {
        totalDoctors: doctors.length,
        totalPatients: patients.length,
        totalScans: scans.length,
        totalAppointments: appointments.length,
        pendingCases: scans.filter(s => s.overallSeverity === 'High' || s.overallSeverity === 'Critical').length,
        completedTreatments: appointments.filter(a => a.status === 'Completed').length,
        highRiskPatients: patients.filter(p => p.riskLevel === 'High').length,
      };

      return res.status(200).json({ analytics, doctors, recentAuditLogs: auditLogs.slice(0, 10) });
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Failed to fetch admin analytics.' });
    }
  },

  async getAuditLogs(req: Request, res: Response) {
    try {
      const logs = await FirebaseService.getAuditLogs();
      return res.status(200).json({ logs });
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Failed to fetch audit logs.' });
    }
  }
};
