import { Router } from 'express';
import {
  getAllDoctors,
  createDoctor,
  getDoctorAvailability,
  updateDoctor,
  deleteDoctor,
  updateDoctorSchedule,
  getDoctorSchedule,
} from '../controllers/doctorController';
import { validate } from '../middleware/validate';
import { createDoctorSchema } from '../validators/doctorValidator';
import { authGuard } from '../middleware/authGuard';

const router = Router();

router.get('/', getAllDoctors);
router.post('/', authGuard, validate(createDoctorSchema), createDoctor);
router.get('/:id/availability', getDoctorAvailability);
router.put('/:id', authGuard, updateDoctor);
router.delete('/:id', authGuard, deleteDoctor);
router.get('/:id/schedule', getDoctorSchedule);
router.put('/:id/schedule', authGuard, updateDoctorSchedule);

export default router;