import { StatusCodes } from "http-status-codes";
import Instructor from "../models/instructorModel";
import { Request, Response } from "express";
import jwt from 'jsonwebtoken'

const JWTSECRET = process.env.JWT_SECRET

export const register = async (req: Request, res: Response)=>{
    try {
        if(!JWTSECRET){
            res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY)
            return
        }
        const instructor = await Instructor.create({...req.body})
        const token = await jwt.sign({email: instructor.email, name: instructor.name}, JWTSECRET)
        res.status(StatusCodes.CREATED).json({instructor: {name: instructor.name}, token})
    } catch (error) {
        res.send(error)
    }
}

export const login = async (req: Request, res: Response)=>{
    res.send('Instructor login route working')
}

export const logout = async (req: Request,res: Response)=>{
    res.send('Instructor logout route working')
}