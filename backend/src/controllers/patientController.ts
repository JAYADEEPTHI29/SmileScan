import { Request, Response } from 'express';
import { FirebaseService } from '../services/firebaseService';

export const patientController = {
  async getPatients(req: Request, res: Response) {
    try {
      const patients = await FirebaseService.getPatients();
      return res.status(200).json({ patients });
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Failed to fetch patients.' });
    }
  },

  async getPatientById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const patient = await FirebaseService.getPatientById(id);
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found.' });
      }
      return res.status(200).json({ patient });
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Failed to fetch patient profile.' });
    }
  },

  async createPatient(req: Request, res: Response) {
    try {
      const { fullName, age, gender, phone, email, address, medicalHistory, dentalHistory, riskLevel } = req.body;

      if (!fullName || !age || !gender || !phone) {
        return res.status(400).json({ message: 'Full name, age, gender, and phone number are required.' });
      }

      const patient = await FirebaseService.createPatient({
        fullName,
        age: Number(age),
        gender,
        phone,
        email: email || '',
        address: address || '',
        medicalHistory: Array.isArray(medicalHistory) ? medicalHistory : [],
        dentalHistory: Array.isArray(dentalHistory) ? dentalHistory : [],
        riskLevel: riskLevel || 'Low',
      });

      const user = (req as any).user;
      if (user) {
        await FirebaseService.logAuditAction(user.id, user.name, 'PATIENT_CREATED', `Added patient ${patient.fullName} (${patient.id})`, req.ip);
      }

      return res.status(201).json({ message: 'Patient profile created successfully.', patient });
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Failed to create patient.' });
    }
  },

  async updatePatient(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updated = await FirebaseService.updatePatient(id, req.body);
      if (!updated) {
        return res.status(404).json({ message: 'Patient not found.' });
      }
      return res.status(200).json({ message: 'Patient profile updated.', patient: updated });
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Failed to update patient.' });
    }
  },

  async deletePatient(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const success = await FirebaseService.deletePatient(id);
      if (!success) {
        return res.status(404).json({ message: 'Patient not found or could not be deleted.' });
      }
      return res.status(200).json({ message: 'Patient profile deleted.' });
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Failed to delete patient.' });
    }
  }
};
