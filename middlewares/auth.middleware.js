import {validateUserToken} from '../utils/token.js'

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */



export function authenticationMiddleware(req,res,next){
    const authHeader = req.headers['authorization'];

    if(!authHeader) return next();

    if(!authHeader.startsWith('Bearer'))
        return res.status(400).json({error : "Auth header should starts with Bearer"});

    const [  , token] = authHeader.split(' ');

    const payload = validateUserToken(token);

    req.user = payload;
    next();

}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */

export function ensureAuthenticated(req,res,next){
if(!req.user || !req.user.id){
    return res.status(401).json({error:"Must be loggeed in to access this resouce"});
}
}