import { StatusCodes } from "http-status-codes";
import Instructor from "../models/instructorModel";
import { Request, Response } from "express";
import jwt from 'jsonwebtoken'
import customApiErrors from "../errors/customApiErrors";


export const register = async (req: Request, res: Response) => {
    const { name, specialities, availableTime, formOfService, classStartTime, classTime, email, password } = req.body
    if (!name || !specialities || !availableTime || !formOfService || !classStartTime || !classStartTime || !classTime || !email || !password) {
        throw new customApiErrors.BadRequestError('Please, provide a valid payload.')
    }
    const dateParsed = Date.parse(classStartTime)
    const instructor = await Instructor.create({ name, specialities, availableTime, formOfService, classStartTime: dateParsed, classTime, email, password })

    const token = await jwt.sign({ _id: instructor._id, name: instructor.name }, process.env.JWT_SECRET)

    return res.status(StatusCodes.CREATED).json({ instructor: { _id: instructor._id, name: instructor.name }, token })
}

export const login = async (req: Request, res: Response) => {
    res.send('Instructor login route working')
}

export const logout = async (req: Request, res: Response) => {
    res.send('Instructor logout route working')
}