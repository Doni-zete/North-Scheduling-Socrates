import jwt from "jsonwebtoken";
import customApiErrors from "../errors/customApiErrors";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export const authenticateUser = async (req: Request, res:Response, next: NextFunction)=>{

    const authHeader = req.headers.authorization

    if(!authHeader){
        throw new customApiErrors.UnauthenticatedError("No token found")
    }
    const token = authHeader.replace('Bearer ', '')

    if(!process.env.JWT_SECRET){
        res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY)
        return
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET) as {email: string}

    if(!payload){
        throw new customApiErrors.UnauthenticatedError('Invalid token payload')
    }

    res.locals.useremail = payload.email

    next()
}