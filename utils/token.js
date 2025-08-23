import jwt from 'jsonwebtoken';
import {userTokenSchema} from '../validation/token.validation.js'
const JWT_SECRET = process.env.JWT_SECRET;

export async function createUserToken(payload){
    const validationResult = await userTokenSchema.safeParseAsync(payload);

    if(validationResult.error) throw new Error(validationResult.error.format());
    const payloadValidationData = validationResult.data;

    const token = jwt.sign(payloadValidationData, JWT_SECRET);
    return token;
}


export function validateUserToken(token){
    try{
        const payload = jwt.verify(token, JWT_SECRET)
    return payload
    } catch(err) {
        console.log(err.message);
        return null;
    }
    
}