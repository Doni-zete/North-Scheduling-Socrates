import { StatusCodes } from "http-status-codes";
import Instructor from "../models/instructorModel";
import { Request, Response } from "express";
import jwt from 'jsonwebtoken'
import customApiErrors from "../errors/customApiErrors";
import { DATE } from "sequelize";


export const register = async (req: Request, res: Response) => {

    const { name, specialities, availableTime, formOfService, classStartTime, classTime, classLocation, email, password } = req.body

    if (!name || !specialities || !availableTime || !formOfService || !classStartTime || !classTime || !email || !password) {
        throw new customApiErrors.BadRequestError('Please provide valid payload.')
    }

    // Verificação da necessidade do Local de aula
    if (formOfService === 'presential' && !classLocation) {
        throw new customApiErrors.BadRequestError('Please provide a classLocation')
    }

    const dateParsed = Date.parse(classStartTime)

    // Criação do Instrutor
    if (formOfService === 'presential' && classLocation) {
        const instructor = await Instructor.create({ name, specialities, availableTime, formOfService, classStartTime: dateParsed, classTime, classLocation, email, password })

        return res.status(StatusCodes.CREATED).json({ instructor: { _id: instructor._id, name: instructor.name, role: 'instructor' } })
    } else {
        const instructor = await Instructor.create({ name, specialities, availableTime, formOfService, classStartTime: dateParsed, classTime, email, password })

        return res.status(StatusCodes.CREATED).json({ instructor: { _id: instructor._id, name: instructor.name, role: 'instructor' } })
    }

}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw new customApiErrors.BadRequestError('Please provide email and password')
    }

    const user = await Instructor.findOne({ email })

    if (!user) {
        throw new customApiErrors.UnauthenticatedError("Invalid Credentials")
    }

    const isPasswordCorrect = await user.comparePassword(password)

    if (!isPasswordCorrect) {
        throw new customApiErrors.UnauthenticatedError('Invalid Credentials')
    }

    const token = jwt.sign({ id: user._id, name: user.name, role: 'instructor' }, process.env.JWT_SECRET)

    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 30 * 60 * 1000)
    })

    res.status(StatusCodes.OK).json({ user: { name: user.name }, message: 'Logged in successfully' })
}

export const logout = async (req: Request, res: Response) => {
    res.clearCookie('token')
    res.status(StatusCodes.OK).json({
        msg: 'user logged out!'
    })
}