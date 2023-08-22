import { StatusCodes } from "http-status-codes";
import instructor from "../models/instructorModel";
import { Request, Response } from "express";
import customApiErrors from "../errors/customApiErrors";

export const register = async (req: Request, res: Response)=>{
    res.send('Instructor register route working')
}

export const login = async (req: Request, res: Response)=>{
    res.send('Instructor login route working')
}

export const logout = async (req: Request,res: Response)=>{
    res.send('Instructor logout route working')
}