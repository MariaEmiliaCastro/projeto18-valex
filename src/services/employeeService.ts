import { findById } from "../repositories/employeeRepository";
import { findByTypeAndEmployeeId, TransactionTypes } from "../repositories/cardRepository";

const employee = {
    findById: async (id: number) => {
        const employee = await findById(id);

        if (!employee) {
            throw ({code: "NotFound", message: "Employee not found"});
        }

        return employee;
    },
    checkIfEmployeeHasCard: async (employeeId: number, cardType: string) => {

        const transactionType : TransactionTypes = cardType as TransactionTypes;

        const hasCard = await findByTypeAndEmployeeId(transactionType, employeeId);

        if (hasCard) {
            throw ({code: "Conflict", message: "Employee already has this card"});
        }

        return hasCard;
    }
}

export default employee;