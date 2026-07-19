// src/seedAdmin.ts
import bcrypt from "bcrypt";
import prisma from "./lib/prisma";

async function main() {
  const email = "admin@dentalclinic.com"; // غيّرها للإيميل اللي تبيه
  const plainPassword = "Admin123!";       // غيّرها لكلمة سر قوية

  // نحوّل كلمة السر العادية إلى hash مشفّر
  // الرقم 10 هو "عدد الجولات" (salt rounds) — كل ما زاد، زاد الأمان لكن زاد وقت التشفير
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const admin = await prisma.admin.create({
    data: {
      email: email,
      password: hashedPassword,
    },
  });

  console.log("✅ تم إنشاء المدير بنجاح:");
  console.log({ id: admin.id, email: admin.email });
}

main()
  .catch((error) => {
    console.error("❌ صار خطأ:", error);
  })
  .finally(async () => {
    await prisma.$disconnect(); // نقفل الاتصال بقاعدة البيانات بعد ما نخلص
  });