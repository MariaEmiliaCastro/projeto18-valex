import { Router } from "express";
import cardRoutes from "./cardsRoutes";
import paymentRoutes from "./paymentRoutes";

const router = Router();

router.use(cardRoutes);
router.use(paymentRoutes);

export default router;