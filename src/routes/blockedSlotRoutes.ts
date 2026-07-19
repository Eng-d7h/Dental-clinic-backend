import { Router } from "express";
import { blockSlot, unblockSlot, getAllBlockedSlots } from "../controllers/blockedSlotController";
import { authGuard } from "../middleware/authGuard";

const router = Router();

router.get("/", getAllBlockedSlots);           // عرض الأوقات المعطلة — بدون حماية
router.post("/", authGuard, blockSlot);         // تعطيل وقت — محمي
router.delete("/:id", authGuard, unblockSlot);  // إلغاء تعطيل — محمي

export default router;