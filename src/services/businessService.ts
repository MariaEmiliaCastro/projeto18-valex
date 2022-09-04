import * as businessRepository from "../repositories/businessRepository";

const business = {
    businessExists: async (businessId : number) => {
        const business = await businessRepository.findById(businessId);
        if(!business){
            throw ({code:"Invalid", message:"Business does not exist!"})
        }

        return business;
    }
}

export default business;