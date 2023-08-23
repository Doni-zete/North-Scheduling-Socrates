import { StatusCodes } from "http-status-codes";
import Instructor from "../models/instructorModel";
import { Request, Response } from "express";
import jwt from 'jsonwebtoken'
import customApiErrors from "../errors/customApiErrors";


export const register = async (req: Request, res: Response) => {
    
    const requiredFields = ['name', 'specialities', 'availableTime', 'formOfService', 'classStartTime', 'classTime', 'email', 'password']
    const missingFields = requiredFields.filter(field => !(field in req.body))

    // Validação do body
    if (missingFields.length > 0) {
        throw new customApiErrors.BadRequestError('Please, provide a valid payload.')
    }
    
    const { name, specialities, availableTime, formOfService, classStartTime, classTime, classLocation, email, password } = req.body

    // Verificação da necessidade do Local de aula
    if (formOfService === 'presential' && !classLocation){
        throw new customApiErrors.BadRequestError('Please provide a classLocation')
    }

    const dateParsed = Date.parse(classStartTime)

    // Criação do Instrutor
    const instructor = await Instructor.create({ name, specialities, availableTime, formOfService, classStartTime: dateParsed, classTime, email, password })

    // criação do token
    const token = jwt.sign({ _id: instructor._id, name: instructor.name }, process.env.JWT_SECRET)

    return res.status(StatusCodes.CREATED).json({ instructor: { _id: instructor._id, name: instructor.name }, token })
}

export const login = async (req: Request, res: Response) => {
    const {email, password} = req.body

    if(!email || !password){
        throw new customApiErrors.BadRequestError('Please provide email and password')
    }

    const user = await Instructor.findOne({email})

    if(!user){
        throw new customApiErrors.UnauthenticatedError("Invalid Credentials")
    }

    const isPasswordCorrect = await user.comparePassword(password)

    if(!isPasswordCorrect){
        throw new customApiErrors.UnauthenticatedError('Invalid Credentials')
    }

    if(!process.env.JWT_SECRET){
        res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY)
        return
    }

    const token = jwt.sign({email: user.email, name:user.name}, process.env.JWT_SECRET)

    res.status(StatusCodes.OK).json({user: {name:user.name}, token})
}

export const logout = async (req: Request, res: Response) => {
    res.send('Instructor logout route working')
}