import company from "../services/companyService";
import employee from "../services/employeeService";
import card from "../services/cardService";
import { Request, Response } from "express";


const cards = {
    createCard: async (req: Request, res: Response) => {
        
        const authorization : string | string[] = req.headers["x-api-key"] || [];
        const employeeId : number = req.body.employeeId || 0;
        const cardType : string = req.body.cardType || "";

        const validateApiKey = await company.findByApiKey(authorization.concat().toString());
    
        const employeeExists = await employee.findById(validateApiKey.id);

        const employeeHasCard = await employee.checkIfEmployeeHasCard(employeeId, cardType);

        await card.createCard(employeeId, employeeExists.fullName, cardType);

        return res.sendStatus(201)

    },
    activateCard: async (req: Request, res: Response) => {
        const cardExists = await card.findById(req.body.cardId);
        const cardIsValid = await card.cardIsValid(cardExists.expirationDate, req.body.cvc, cardExists.securityCode, cardExists.password);
        const savePassword = await card.savePassword(cardExists.id, req.body.password);

        res.sendStatus(204);
    }
}

export default cards;