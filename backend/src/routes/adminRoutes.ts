import { Router } from 'express';
import { adminController } from '../controllers/adminController';
import { authenticateJWT, authorizeRoles } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateJWT);
router.use(authorizeRoles('ADMIN'));

router.get('/analytics', adminController.getDashboardAnalytics);
router.get('/audit-logs', adminController.getAuditLogs);

export default router;
