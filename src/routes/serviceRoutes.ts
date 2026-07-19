import { Router } from 'express';
import { getAllServices, createService } from '../controllers/serviceController';
import { validate } from '../middleware/validate';
import { createServiceSchema } from '../validators/serviceValidator';

const router = Router();

router.get('/', getAllServices);
router.post('/', validate(createServiceSchema), createService);

export default router;