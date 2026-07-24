import { Request, Response } from 'express';
import { FirebaseService } from '../services/firebaseService';

export const appointmentController = {
  async getAppointments(req: Request, res: Response) {
    try {
      const appointments = await FirebaseService.getAppointments();
      return res.status(200).json({ appointments });
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Failed to fetch appointments.' });
    }
  },

  async createAppointment(req: Request, res: Response) {
    try {
      const { patientId, date, time, type, notes } = req.body;
      if (!patientId || !date || !time || !type) {
        return res.status(400).json({ message: 'Patient, date, time, and appointment type are required.' });
      }

      const patient = await FirebaseService.getPatientById(patientId);
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found.' });
      }

      const user = (req as any).user;
      const doctorId = user?.id || 'doc_101';
      const doctorName = user?.name || 'Dr. Sarah Jenkins, DDS';

      const appointment = await FirebaseService.createAppointment({
        patientId: patient.id,
        patientName: patient.fullName,
        doctorId,
        doctorName,
        date,
        time,
        type,
        status: 'Scheduled',
        notes: notes || '',
      });

      return res.status(201).json({ message: 'Appointment scheduled successfully.', appointment });
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Failed to schedule appointment.' });
    }
  },

  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updated = await FirebaseService.updateAppointmentStatus(id, status);
      if (!updated) {
        return res.status(404).json({ message: 'Appointment not found.' });
      }

      return res.status(200).json({ message: 'Appointment status updated.', appointment: updated });
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Failed to update appointment status.' });
    }
  },

  async deleteAppointment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const success = await FirebaseService.deleteAppointment(id);
      if (!success) {
        return res.status(404).json({ message: 'Appointment not found.' });
      }
      return res.status(200).json({ message: 'Appointment cancelled/deleted successfully.' });
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Failed to delete appointment.' });
    }
  }
};
