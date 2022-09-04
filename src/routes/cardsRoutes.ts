import { Router } from "express";
import cards from "../controllers/cardsController";
import { schemaValidate } from "../middlewares/validateSchemaMiddleware";
import schemas from '../schemas/allSchemas';

const cardRoutes = Router();

cardRoutes.post("/create-card", schemaValidate(schemas.validateCreateCard), cards.createCard);
cardRoutes.post("/activate-card", schemaValidate(schemas.validateActivateCard), cards.activateCard);
cardRoutes.post("/recharge", schemaValidate(schemas.validateRechargeCard), cards.rechargeCard);
cardRoutes.post("/block-card", schemaValidate(schemas.validateDeactivateCard), cards.blockCard);
cardRoutes.post("/unblock-card", schemaValidate(schemas.validateDeactivateCard), cards.unblockCard);
cardRoutes.get("/balance/:id", cards.getBalanceAndTransactions);

export default cardRoutes;