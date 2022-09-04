import { findById, CardInsertData, TransactionTypes, insert, findByCardDetails, update } from "../repositories/cardRepository";
import { faker } from '@faker-js/faker';
import { date } from "joi";

const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotallySecretKey');

const bcrypt = require('bcrypt');

const card = {
    findById: async (id: number) => {
        const card = await findById(id);
        
        if (!card) {
            throw ({code: "NotFound", message: "Card not found!"});
        }
        console.log(cryptr.decrypt(card.securityCode));
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
    cardIsValid:async (validThru:string, securityCodeReq : string, securityCode : string, password : string | undefined) => {
        const today = new Date();
        const separateDate : string[] = validThru.split('/');
        const cardExpirationDate = new Date(Number(separateDate[1]) + 2000, Number(separateDate[0]), 1);
        console.log(today);
        console.log("aaaaaaaaaa", cardExpirationDate);

        if(securityCodeReq !== cryptr.decrypt(securityCode)){
            throw ({code:"Invalid", message:"Security Code invalid!"});
        }

        console.log(password)
        if(password !== null){
            throw ({code:"Invalid", message:"Password already registered!"});
        }

        if(cardExpirationDate < today) {
            throw ({code:"Invalid", message:"Card Expired!"});
        }

        return true;
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
    savePassword: async (cardId: number, password: string) => {
        const updateCardInfo = await update(cardId, {password : bcrypt.hashSync(password, 10), isBlocked: false});
    }
}

export default card;