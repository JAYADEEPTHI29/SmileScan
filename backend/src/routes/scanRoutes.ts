import { Router } from 'express';
import { scanController } from '../controllers/scanController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { uploadSingleImage } from '../middleware/uploadMiddleware';

const router = Router();

router.use(authenticateJWT);

router.post('/upload', uploadSingleImage, scanController.processScan);
router.get('/', scanController.getAllScans);
router.get('/:id', scanController.getScanById);

export default router;
