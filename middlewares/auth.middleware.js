import {validateUserToken} from '../utils/token.js'


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