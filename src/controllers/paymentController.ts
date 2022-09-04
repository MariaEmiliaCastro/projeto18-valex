import company from "../services/companyService";
import employee from "../services/employeeService";
import card from "../services/cardService";
import { Request, Response } from "express";
import business from "../services/businessService";
import paymentService from "../services/paymentService";

const payment = {
    registerPayment: async (req: Request, res: Response) => {

        const cardExists = await card.findById(req.body.cardId);
        await card.cardIsActive(cardExists.isBlocked);

        await card.checkPassword(req.body.password, cardExists.password);
        const businessInfo = await business.businessExists(req.body.businessId);

        await card.checkCategory(cardExists.type, businessInfo.type);

        const balance = await card.calculateBalance(req.body.cardId);

        await paymentService.savePayment(balance, req.body.amount, req.body.cardId, req.body.businessId);
        
        return res.sendStatus(200);
    }
}

export default payment;