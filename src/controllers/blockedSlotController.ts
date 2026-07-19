import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// تعطيل وقت معين
export const blockSlot = async (req: Request, res: Response) => {
  try {
    const { doctorId, date, startTime, reason } = req.body;

    const blocked = await prisma.blockedSlot.create({
      data: {
        doctorId,
        date: new Date(date),
        startTime,
        reason,
      },
    });

    res.status(201).json(blocked);
  } catch (error) {
    res.status(500).json({ message: 'Failed to block time slot', error });
  }
};

// إلغاء تعطيل وقت (يرجع متاح)
export const unblockSlot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.blockedSlot.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: 'Time slot unblocked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to unblock time slot', error });
  }
};

// عرض كل الأوقات المعطّلة (لعرضها بلوحة تحكم المدير لاحقًا)
export const getAllBlockedSlots = async (req: Request, res: Response) => {
  try {
    const blocked = await prisma.blockedSlot.findMany({
      include: { doctor: true },
    });
    res.status(200).json(blocked);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch blocked slots', error });
  }
};