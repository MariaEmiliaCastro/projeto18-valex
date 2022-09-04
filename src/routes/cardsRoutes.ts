import { Router } from "express";
import cards from "../controllers/cardsController";

const cardRoutes = Router();

cardRoutes.post("/create-card", cards.createCard);
cardRoutes.post("/activate-card", cards.activateCard);

export default cardRoutes;