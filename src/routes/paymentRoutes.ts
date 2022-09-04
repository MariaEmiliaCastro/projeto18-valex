import { Router } from "express";
import payment from "../controllers/paymentController";
import { schemaValidate } from "../middlewares/validateSchemaMiddleware";
import schemas from '../schemas/allSchemas';

const paymentRoutes = Router();

paymentRoutes.post("/payment", schemaValidate(schemas.validatePayment), payment.registerPayment);

export default paymentRoutes;