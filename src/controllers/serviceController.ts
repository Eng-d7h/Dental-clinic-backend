import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getAllServices = async (req: Request, res: Response) => {
  try {
    const services = await prisma.service.findMany();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch services', error });
  }
};

export const createService = async (req: Request, res: Response) => {
  try {
    const { name, price, duration } = req.body;
    const newService = await prisma.service.create({ data: { name, price, duration } });
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create service', error });
  }
};