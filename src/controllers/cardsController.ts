import company from "../services/companyService";
import employee from "../services/employeeService";
import card from "../services/cardService";
import { Request, Response } from "express";
import recharge from "../services/rechargeService";
import * as getPayments from "../repositories/paymentRepository";
import { balanceRecharges, findByCardId } from "../repositories/rechargeRepository";


const cards = {
    createCard: async (req: Request, res: Response) => {
        
        const authorization : string | string[] = req.headers["x-api-key"] || [];
        const employeeId : number = req.body.employeeId;
        const cardType : string = req.body.cardType || "";

        const validateApiKey = await company.findByApiKey(authorization.concat().toString());
    
        const employeeExists = await employee.findById(employeeId);

        const employeeHasCard = await employee.checkIfEmployeeHasCard(employeeId, cardType);

        await card.createCard(employeeId, employeeExists.fullName, cardType);

        return res.sendStatus(201)

    },
    activateCard: async (req: Request, res: Response) => {
        const cardExists = await card.findById(req.body.cardId);
        await card.checkSecurityCode(req.body.cvc, cardExists.securityCode);
        const savePassword = await card.savePassword(cardExists.id, req.body.password, cardExists.password);

        res.sendStatus(204);
    },
    getBalanceAndTransactions: async (req: Request, res: Response) => {
        const cardExists = await card.findById(Number(req.params.id));

        const paymentData = await getPayments.findByCardId(cardExists.id);
        const rechargeData = await findByCardId(cardExists.id);
        const balance = await card.calculateBalance(cardExists.id);
        res.status(200).send({balance: balance, transactions: paymentData, recharges : rechargeData});
    },
    rechargeCard: async (req: Request, res: Response) => {
        const authorization : string | string[] = req.headers["x-api-key"] || [];
        await company.findByApiKey(authorization.concat().toString());
        const cardExists = await card.findById(req.body.cardId);

        await card.cardIsActive(cardExists.isBlocked);
        await recharge.updateCard(cardExists.id, req.body.amount);

        res.sendStatus(200);

    },
    blockCard:async (req: Request, res: Response) => {
        const cardExists = await card.findById(req.body.cardId);
        await card.checkPassword(req.body.password, cardExists.password);
        await card.cardIsActive(cardExists.isBlocked);
        await card.blockCard(cardExists.id, true);
        return res.sendStatus(200);
    },
    unblockCard: async (req: Request, res: Response) => {
        const cardExists = await card.findById(req.body.cardId);
        await card.checkPassword(req.body.password, cardExists.password);
        if(cardExists.isBlocked){
            await card.blockCard(cardExists.id, false);
        }
        
        return res.sendStatus(200);
    }
}

export default cards;