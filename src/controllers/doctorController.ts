import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getAllDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await prisma.doctor.findMany();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch doctors', error });
  }
};

export const createDoctor = async (req: Request, res: Response) => {
  try {
    const { name, specialty } = req.body;
    const newDoctor = await prisma.doctor.create({ data: { name, specialty } });
    res.status(201).json(newDoctor);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create doctor', error });
  }
};

export const getDoctorAvailability = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    const doctorId = Number(id);
    const requestedDate = new Date(date as string);
    const dayOfWeek = requestedDate.getDay();

    const schedule = await prisma.doctorSchedule.findFirst({
      where: { doctorId, dayOfWeek },
    });

    if (!schedule) {
      return res.status(200).json({ slots: [], message: 'Doctor is not available on this day' });
    }

    const slots: string[] = [];
    let [startHour] = schedule.startTime.split(':').map(Number);
    const [endHour] = schedule.endTime.split(':').map(Number);

    while (startHour < endHour) {
      const formattedTime = `${String(startHour).padStart(2, '0')}:00`;
      slots.push(formattedTime);
      startHour += 1;
    }

    // الحجوزات الموجودة
    const existingAppointments = await prisma.appointment.findMany({
      where: { doctorId, date: requestedDate, status: { not: 'cancelled' } },
      select: { startTime: true },
    });

    // الأوقات المحجوبة يدويًا من المدير
    const blockedSlots = await prisma.blockedSlot.findMany({
      where: { doctorId, date: requestedDate },
      select: { startTime: true },
    });

    const bookedTimes = existingAppointments.map((a) => a.startTime);
    const blockedTimes = blockedSlots.map((b) => b.startTime);

    const result = slots.map((time) => ({
      time,
      available: !bookedTimes.includes(time) && !blockedTimes.includes(time),
    }));

    res.status(200).json({ slots: result });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch available slots', error });
  }
};


// تعديل بيانات طبيب
export const updateDoctor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, specialty } = req.body;

    const updatedDoctor = await prisma.doctor.update({
      where: { id: Number(id) },
      data: { name, specialty },
    });

    res.status(200).json(updatedDoctor);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update doctor', error });
  }
};

// حذف طبيب
export const deleteDoctor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.doctor.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete doctor', error });
  }
};

// تحديث دوام طبيب كامل (يحذف القديم وينشئ الجديد)
export const updateDoctorSchedule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doctorId = Number(id);
    const { schedule } = req.body;
    // schedule متوقع يكون مصفوفة:
    // [{ dayOfWeek: 0, startTime: "09:00", endTime: "17:00" }, ...]

    // نحذف كل الدوام القديم لهذا الطبيب أول
    await prisma.doctorSchedule.deleteMany({
      where: { doctorId },
    });

    // ننشئ الدوام الجديد (بس الأيام المفعّلة اللي أرسلها المدير)
    if (schedule.length > 0) {
      await prisma.doctorSchedule.createMany({
        data: schedule.map((day: { dayOfWeek: number; startTime: string; endTime: string }) => ({
          doctorId,
          dayOfWeek: day.dayOfWeek,
          startTime: day.startTime,
          endTime: day.endTime,
        })),
      });
    }

    const updatedSchedule = await prisma.doctorSchedule.findMany({
      where: { doctorId },
    });

    res.status(200).json(updatedSchedule);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update schedule', error });
  }
};

// جلب دوام طبيب معيّن (لعرضه وقت فتح فورم التعديل)
export const getDoctorSchedule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const schedule = await prisma.doctorSchedule.findMany({
      where: { doctorId: Number(id) },
    });
    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch schedule', error });
  }
};