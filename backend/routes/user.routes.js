import express from 'express';
import { db } from '../db/index.js'; // <-- Corrected
import { usersTable } from '../models/index.js'; // <-- Corrected
// import { createHmac, randomBytes } from 'crypto';
import { signupPostRequestBodySchema, loginPostRequestBodySchema} from '../validation/request.validation.js';
// import { eq } from 'drizzle-orm'; // <-- Add this import
import {hashPasswordWithSalt, } from '../utils/hash.js'
import {getUserByEmail} from '../services/user.service.js';
import jwt from 'jsonwebtoken';
const router = express.Router();
import {createUserToken} from '../utils/token.js'

router.post('/signup', async (req, res)=>{
    const validationResult = await signupPostRequestBodySchema.safeParseAsync(req.body);

    // if(!firstname) return res.status(400).json({error : 'first name required'});

    if(validationResult.error) {
        return res.status(400).json({error: validationResult.error.format()})
    }

    const { firstname, lastname, email, password} = validationResult.data;

    // const [existingUser] =  await db
    //                 .select({
    //                     id: usersTable.id,
    //                 })
    //                 .from(usersTable)
    //                 .where(eq(usersTable.email, email))  


    const existingUser = await getUserByEmail(email);
        if(existingUser) return res.status(400).json({error :`User with email ${email} already exists`});
               
                

    // const salt = randomBytes(256).toString('hex');
    // const hashedPassword = createHmac('sha256', salt).update(password).digest('hex');

   const {salt, password: hashedPassword} = hashPasswordWithSalt(password)

        const user = await db.insert(usersTable).values({
            email,
            firstname,
            lastname,
            salt,
            password : hashedPassword,
        }).returning({id:usersTable.id})

return res.status(201).json({data : {userId : user[0].id}});
 });

 router.post('/login', async(req,res)=>{
    const validationResult = await loginPostRequestBodySchema.safeParseAsync(req.body)

    if(validationResult.error){
        return res.status(400).json({error : validationResult.error.format()})
    }
    const {email, password} = validationResult.data;

    const user = await getUserByEmail(email);

    if(!user){
        return res.status(404).json({error:`user with email ${email} does not exists`});
    }

    const {password : hashedPassword} = hashPasswordWithSalt(password, user.salt);

    if(user.password !== hashedPassword) {
        return res.status(400).json({error :" Invalid password"});
    }

    const token = await createUserToken({id : user.id})
   

    return res.json({token});
 })

export default router;