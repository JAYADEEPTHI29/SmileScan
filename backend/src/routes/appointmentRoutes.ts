import { Router } from 'express';
import { appointmentController } from '../controllers/appointmentController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateJWT);

router.get('/', appointmentController.getAppointments);
router.post('/', appointmentController.createAppointment);
router.patch('/:id/status', appointmentController.updateStatus);
router.delete('/:id', appointmentController.deleteAppointment);

export default router;
