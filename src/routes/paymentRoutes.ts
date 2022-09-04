import { Router } from "express";
import payment from "../controllers/paymentController";

const paymentRoutes = Router();

paymentRoutes.post("/payment", payment.registerPayment);

export default paymentRoutes;