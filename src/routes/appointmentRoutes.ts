import { Router } from 'express';
import {
  getAllAppointments,
  createAppointment,
  cancelAppointment,
  deleteAppointment,
} from '../controllers/appointmentController';
import { validate } from '../middleware/validate';
import { createAppointmentSchema } from '../validators/appointmentValidator';
import { authGuard } from '../middleware/authGuard';

const router = Router();

router.get('/', getAllAppointments);
router.post('/', validate(createAppointmentSchema), createAppointment);
router.patch('/:id/cancel', authGuard, cancelAppointment);
router.delete('/:id', authGuard, deleteAppointment);

export default router;