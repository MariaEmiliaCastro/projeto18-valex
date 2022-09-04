import { Router } from "express";
import cards from "../controllers/cardsController";

const cardRoutes = Router();

cardRoutes.post("/create-card", cards.createCard);
cardRoutes.post("/activate-card", cards.activateCard);
cardRoutes.post("/recharge", cards.rechargeCard);
cardRoutes.post("/block-card", cards.blockCard);
cardRoutes.get("/balance/:id", cards.getBalanceAndTransactions);

export default cardRoutes;