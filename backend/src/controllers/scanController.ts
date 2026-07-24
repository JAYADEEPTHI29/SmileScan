import { Request, Response } from 'express';
import { analyzeDentalImage } from '../services/aiAnalysisEngine';
import { FirebaseService } from '../services/firebaseService';
import { ScanReport } from '../types';

export const scanController = {
  async processScan(req: Request, res: Response) {
    try {
      const file = req.file;
      const { patientId, imageType, notes } = req.body;

      if (!file) {
        return res.status(400).json({ message: 'Radiograph image file is required for AI analysis.' });
      }

      if (!patientId) {
        return res.status(400).json({ message: 'Patient selection is required.' });
      }

      const patient = await FirebaseService.getPatientById(patientId);
      if (!patient) {
        return res.status(404).json({ message: 'Selected patient record not found.' });
      }

      const authUser = (req as any).user;
      const doctorId = authUser?.id || 'doc_101';
      const doctorName = authUser?.name || 'Dr. Sarah Jenkins, DDS';

      // Execute deep AI vision analytics engine
      const aiResult = analyzeDentalImage(file.filename, file.originalname);

      // Create downloadable image path / URL
      const imageUrl = `/uploads/${file.filename}`;

      const report: ScanReport = {
        id: `scan_${Date.now()}`,
        patientId: patient.id,
        patientName: patient.fullName,
        doctorId,
        doctorName,
        imageUrl,
        imageType: imageType || 'X-Ray',
        predictions: aiResult.predictions,
        overallSeverity: aiResult.overallSeverity,
        overallConfidence: aiResult.overallConfidence,
        status: 'Completed',
        notes: notes || 'AI Clinical Decision Support diagnosis completed.',
        createdAt: new Date().toISOString(),
      };

      await FirebaseService.saveScanReport(report);
      await FirebaseService.updatePatient(patient.id, { lastVisit: new Date().toISOString() });
      await FirebaseService.logAuditAction(doctorId, doctorName, 'AI_SCAN_COMPLETED', `Ran dental scan diagnosis for ${patient.fullName}`, req.ip);

      return res.status(200).json({
        message: 'AI Scan diagnosis completed successfully.',
        report,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'AI Scan processing failed.' });
    }
  },

  async getAllScans(req: Request, res: Response) {
    try {
      const scans = await FirebaseService.getScans();
      return res.status(200).json({ scans });
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Failed to fetch scan reports.' });
    }
  },

  async getScanById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const scan = await FirebaseService.getScanById(id);
      if (!scan) {
        return res.status(404).json({ message: 'Scan report not found.' });
      }
      return res.status(200).json({ scan });
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Failed to fetch scan details.' });
    }
  }
};
