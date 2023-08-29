import Instructor from '../models/instructorModel'
import { StatusCodes } from 'http-status-codes'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import customApiErrors from '../errors/customApiErrors'
import mongoose from 'mongoose'


const register = async (req: Request, res: Response) => {
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

const login = async (req: Request, res: Response) => {
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
    res.cookie('token', token, { httpOnly: true, expires: new Date(Date.now() + 30 * 60 * 1000), signed: true })

    return res.status(StatusCodes.OK).json({ user: { name: user.name }, msg: 'Logged in successfully' })
}

const logout = async (req: Request, res: Response) => {
    res.clearCookie('token')

    return res.status(StatusCodes.OK).json({ msg: 'User logged out!' })
}

const findAll = async (req: Request, res: Response) => {
    const instructors = await Instructor.find({})

    return res.status(StatusCodes.OK).json({ instructors })
}

const findById = async (req: Request, res: Response) => {
    const instructor = await Instructor.findById(req.params.id)
    if (!instructor) {
        throw new customApiErrors.NotFoundError('Record was not found')
    }

    return res.status(StatusCodes.OK).json({ instructor })
}

const updateId = async (req: Request, res: Response) => {
    const id = req.params.id
    const instructorData: {} = req.body
    if (!id) {
        throw new customApiErrors.BadRequestError('Invalid Credentials')
    }

    if (!instructorData) {
        throw new customApiErrors.BadRequestError('Please provide the data to be updated')
    }

    if (!mongoose.isValidObjectId(id)) {
        throw new customApiErrors.BadRequestError(`Id provided is out of standard: ${id}`)
    }
    const updatedInstructor = await Instructor.findByIdAndUpdate(id, instructorData, { new: true })

    if (!updatedInstructor) {
        throw new customApiErrors.NotFoundError(`Instructor not found: ${id}`)
    }

    return res.status(StatusCodes.OK).json({ updatedInstructor })
}

const deleteId = async (req: Request, res: Response) => {
    const id = req.params.id
    if (!id) {
        throw new customApiErrors.BadRequestError('Invalid Credentials')
    }

    if (!mongoose.isValidObjectId(id)) {
        throw new customApiErrors.BadRequestError(`Id provided is out of standard: ${id}`)
    }

    const instructor = await Instructor.findByIdAndRemove({ _id: id })

    if (!instructor) {
        throw new customApiErrors.NotFoundError(`Instructor not found: ${id}`)
    }

    return res.status(StatusCodes.OK).json({ msg: "Instructor deleted successfully" })
}


const instructorController = { register, login, logout, findAll, findById, updateId, deleteId }

export default instructorController