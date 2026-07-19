import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getAllAppointments = async (req: Request, res: Response) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        doctor: true,
      },
    });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch appointments', error });
  }
};

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const { patientName, patientPhone, doctorId, date, startTime } = req.body;

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId,
        date: new Date(date),
        startTime,
        status: { not: 'cancelled' },
      },
    });

    if (existingAppointment) {
      return res.status(409).json({
        message: 'Invalid data',
        errors: [{ field: 'startTime', message: 'This time slot is already booked for this doctor' }],
      });
    }

    const newAppointment = await prisma.appointment.create({
      data: {
        patientName,
        patientPhone,
        doctorId,
        date: new Date(date),
        startTime,
      },
      include: { doctor: true },
    });

    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create appointment', error });
  }
};

// إلغاء حجز (يرجع الوقت متاح تلقائيًا)
export const cancelAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updatedAppointment = await prisma.appointment.update({
      where: { id: Number(id) },
      data: { status: 'cancelled' },
    });

    res.status(200).json({ message: 'Appointment cancelled successfully', appointment: updatedAppointment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel appointment', error });
  }
};

// حذف حجز نهائيًا من قاعدة البيانات
export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const appointmentId = Number(id);

    // نحذف أول أي سجلات خدمات قديمة مرتبطة بهذا الحجز (من قبل حذف نظام الخدمات)
    await prisma.appointmentService.deleteMany({
      where: { appointmentId },
    });

    await prisma.appointment.delete({
      where: { id: appointmentId },
    });

    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete appointment', error });
  }
};