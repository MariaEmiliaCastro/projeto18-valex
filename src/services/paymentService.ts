import * as paymentRepository from "../repositories/paymentRepository";

const payment = {
    savePayment: async (balance: number, amount: number, cardId: number, businessId: number,) => {
        if(balance < amount){
            throw ({code:"Error!", message:"Not enough credits!"});
        }

        const paymentData : paymentRepository.PaymentInsertData = {
            cardId: cardId,
            businessId: businessId,
            amount: amount
        }

        await paymentRepository.insert(paymentData);
    }
}

export default payment;