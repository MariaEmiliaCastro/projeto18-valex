import { insert, RechargeInsertData } from "../repositories/rechargeRepository";

const recharge = {
    updateCard: async (cardId: number, amount: number) => {
        const rechargeData : RechargeInsertData = {
            cardId: cardId,
            amount: amount
        }
        await insert(rechargeData); 
    }
}

export default recharge;