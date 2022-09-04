import { findById, CardInsertData, TransactionTypes, insert, findByCardDetails, update } from "../repositories/cardRepository";
import * as getPayments from "../repositories/paymentRepository";
import { balanceRecharges, findByCardId } from "../repositories/rechargeRepository";
import { faker } from '@faker-js/faker';
import { date } from "joi";

const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotallySecretKey');

const bcrypt = require('bcrypt');

const cardIsExpired = (validThru:string) => {
    const today = new Date();
    const separateDate : string[] = validThru.split('/');
    const cardExpirationDate = new Date(Number(separateDate[1]) + 2000, Number(separateDate[0]), 1);
    
    if(cardExpirationDate < today) {
        throw ({code:"Invalid", message:"Card Expired!"});
    }
} 

const card = {
    findById: async (id: number) => {
        const card = await findById(id);
        
        if (!card) {
            throw ({code: "NotFound", message: "Card not found!"});
        }
        console.log(cryptr.decrypt(card.securityCode));

        cardIsExpired(card.expirationDate);

        return card;
    },
    createCard: async (employeeId: number, employeeName: string, cardType : String) => {
        const cardNumber : string = faker.finance.creditCardNumber();
        const cvv : string = faker.finance.creditCardCVV();
        const expirationDate : string = (new Date().getMonth() + 1).toString() + "/" + (new Date().getFullYear() + 5).toString().substring(2);
        const cardholderName : string = employeeName.toUpperCase();

        const newCard : CardInsertData = {
            employeeId: employeeId,
            number: cardNumber,
            cardholderName: cardholderName,
            securityCode: cryptr.encrypt(cvv),
            expirationDate: expirationDate,
            isVirtual: false,
            isBlocked: true,
            type: cardType as TransactionTypes
        }

        await insert(newCard);
    },
    findByCardDetails: async (
        number: string,
        cardholderName: string,
        securityCode: string
    ) => {
        console.log(cryptr.encrypt(securityCode))
        const cardExists = await findByCardDetails(number, cardholderName, cryptr.encrypt(securityCode));
        console.log(cardExists);
        if(!cardExists) {
            throw ({code: "Invalid", message:"Card details are invalid!"});
        }

        return cardExists;
    },
    savePassword: async (cardId: number, passwordReq: string, password : string | undefined) => {
        if(password !== null){
            throw ({code:"Invalid", message:"Password already registered!"});
        }
        const updateCardInfo = await update(cardId, {password : bcrypt.hashSync(passwordReq, 10), isBlocked: false});
    },
    cardIsActive: async (isBlocked: boolean) => {
        if(isBlocked){
            throw ({code: "Invalid", message:"Card is blocked!"});
        }
    },
    checkPassword: async (passwordReq : string, passwordDb : string | undefined) => {
        if(!bcrypt.compareSync(passwordReq, passwordDb)) {
            throw ({code:"Invalid", message:"Password don´t match!"});
        }
    },
    checkSecurityCode: async (securityCodeReq : string, securityCode : string) => {
        if(securityCodeReq !== cryptr.decrypt(securityCode)){
            throw ({code:"Invalid", message:"Security Code invalid!"});
        }
    },
    checkCategory:async (transactionType:string, businessType: string) => {
        if(transactionType !== businessType){
            throw ({code:"Invalid", message:"Transaction type not allowed for this card!"});
        }
    },
    blockCard: async (cardId: number, block: boolean) => {
        await update(cardId, {isBlocked : block});
    },
    calculateBalance: async (cardId: number) => {
        let paymentTotalValue  = await getPayments.paymentsBalance(cardId);
        let rechargeTotalValue   = await balanceRecharges(cardId);
        if(rechargeTotalValue.balance === null){
            rechargeTotalValue.balance = 0;
        }
        if(paymentTotalValue.balance === null){
            paymentTotalValue.balance = 0;
        }

        return rechargeTotalValue.balance - paymentTotalValue.balance;
    }
}

export default card;