import Student from '../models/studentModel'
import { StatusCodes } from 'http-status-codes'
import { Request, Response } from "express"
import jwt from 'jsonwebtoken'
import customApiErrors from '../errors/customApiErrors'
import mongoose from 'mongoose'


const register = async (req: Request, res: Response) => {
    const { name, email, password, schooling } = req.body
    if (!name || !email || !password || !schooling) {
        throw new customApiErrors.BadRequestError('Please provide valid payload.')
    }

    const student = await Student.create({ name, email, password, schooling })

    return res.status(StatusCodes.CREATED).json({ student: { _id: student._id, name: student.name, role: 'student' } })
}

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new customApiErrors.BadRequestError('Please provide valid payload')
    }

    const user = await Student.findOne({ email })
    if (!user) {
        throw new customApiErrors.UnauthenticatedError("Invalid Credentials")
    }

    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new customApiErrors.UnauthenticatedError('Invalid Credentials')
    }

    const token = jwt.sign({ id: user._id, name: user.name, role: 'student' }, process.env.JWT_SECRET)

    res.cookie('token', token, { httpOnly: true, expires: new Date(Date.now() + 30 * 60 * 1000), signed: true })

    return res.status(StatusCodes.OK).json({ user: { name: user.name }, msg: 'Logged in successfully' })
}

const logout = async (req: Request, res: Response) => {
    res.clearCookie('token')

    return res.status(StatusCodes.OK).json({ msg: 'User logged out!' })
}

const findAll = async (req: Request, res: Response) => {
    const students = await Student.find({})

    return res.status(StatusCodes.OK).json({ students })
}

const findById = async (req: Request, res: Response) => {
    const students = await Student.find({ _id: req.params.id })

    return res.status(StatusCodes.OK).json({ students })
}

const updateId = async (req: Request, res: Response) => {
    const studentData = req.body

    const id = req.params.id
    if (!mongoose.isValidObjectId(id)) {
        throw new customApiErrors.BadRequestError(`Id provided is out of standard: ${id}`)
    }

    const updatedStudent = await Student.findByIdAndUpdate(id, studentData, { new: true })
    if (!updatedStudent) {
        throw new customApiErrors.NotFoundError(`Student not found: ${id}`)
    }

    return res.status(StatusCodes.OK).json(updatedStudent)
}

const deleteId = async (req: Request, res: Response) => {
    const id = req.params.id
    if (!mongoose.isValidObjectId(id)) {
        throw new customApiErrors.BadRequestError(`Id provided is out of standard: ${id}`)
    }

    const student = await Student.findByIdAndRemove({ _id: id })
    if (!student) {
        throw new customApiErrors.NotFoundError(`Student not found: ${id}`)
    }

    return res.status(StatusCodes.OK).json({ msg: `Student deleted successfully` })
}


const studentController = { register, login, logout, findAll, findById, updateId, deleteId }

export default studentController