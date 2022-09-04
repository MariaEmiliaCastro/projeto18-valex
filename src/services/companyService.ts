import { findByApiKey } from "../repositories/companyRepository";

const company = {
    findByApiKey: async (apiKey: string) => {
        console.log(apiKey)
        const company = await findByApiKey(apiKey);

        if (!company) {
            throw ({code: "NotFound", message: "Company not found"});
        }

        return company;
    }
}

export default company;