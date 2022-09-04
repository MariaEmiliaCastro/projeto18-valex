import { Router } from "express";
import cardRoutes from "./cardsRoutes";

const router = Router();

router.use(cardRoutes);

export default router;