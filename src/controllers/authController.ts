import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import  prisma  from "../lib/prisma";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // 1. تأكد إن الإيميل وكلمة السر موجودين بالطلب
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // 2. ابحث عن المدير بهذا الإيميل
  const admin = await prisma.admin.findUnique({ where: { email } });

  if (!admin) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // 3. قارن كلمة السر المُدخلة بالـ hash المخزّن
  const isPasswordValid = await bcrypt.compare(password, admin.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // 4. ولّد JWT token
  const token = jwt.sign(
    { id: admin.id, email: admin.email }, // البيانات اللي بتنخزن جوا التوكن
    process.env.JWT_SECRET as string,      // المفتاح السري للتشفير
    { expiresIn: "1d" }                    // مدة صلاحية التوكن (يوم واحد هنا)
  );

  // 5. رجّع التوكن للمستخدم
  return res.status(200).json({ token });
};