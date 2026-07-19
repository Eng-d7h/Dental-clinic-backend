import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// نوسّع نوع Request عشان نقدر نضيف بيانات المدير بعد التحقق
export interface AuthRequest extends Request {
  admin?: { id: number; email: string };
}

export const authGuard = (req: AuthRequest, res: Response, next: NextFunction) => {
  // 1. نجيب الـ header اللي يحتوي التوكن
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  // 2. نستخرج التوكن (نشيل كلمة "Bearer " من البداية)
  const token = authHeader.split(" ")[1];

  try {
    // 3. نتحقق من صحة التوكن ونفكّه
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
      email: string;
    };

    // 4. نخزّن بيانات المدير بالـ request عشان الـ controller يقدر يستخدمها لاحقًا
    req.admin = decoded;

    // 5. نسمح للطلب يكمل لل controller
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};