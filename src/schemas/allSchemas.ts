import Joi, { required } from "joi";

const schemas = {
    validateCreateCard: Joi.object().keys({
        employeeId: Joi.number().required(),
        cardType: Joi.string().valid('groceries', 'restaurant', 'transport', 'education', 'health')
    }),
    validateActivateCard: Joi.object().keys({
        cardId: Joi.number().required(),
        cvc: Joi.string().required().regex(/^\d+$/).max(3).min(3),
        password: Joi.string().required().regex(/^\d+$/).min(4).max(4)
    }),
    validateDeactivateCard: Joi.object().keys({
        cardId: Joi.number().required(),
        password: Joi.string().required().regex(/^\d+$/).min(4).max(4)
    }),
    validateRechargeCard: Joi.object().keys({
        cardId: Joi.number().required(),
        amount: Joi.number().required()
    }),
    validatePayment: Joi.object().keys({
        cardId: Joi.number().required(),
        password: Joi.string().required().regex(/^\d+$/).min(4).max(4),
        businessId: Joi.number().required(),
        amount: Joi.number().required()
    })
}

export default schemas;