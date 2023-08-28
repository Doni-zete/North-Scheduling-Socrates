import Student from '../models/studentModel'
import { Request, Response } from "express"
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import customApiErrors from '../errors/customApiErrors'
import mongoose from 'mongoose'


export const register = async (req: Request, res: Response) => {
    const { name, email, password, schooling } = req.body
    if (!name || !email || !password || !schooling) {
        throw new customApiErrors.BadRequestError('Please provide valid payload.')
    }

    const students = await Student.create(name, email, password, schooling)

    return res.status(StatusCodes.CREATED).json(students)
}

export const login = async (req: Request, res: Response) => {
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

export const logout = async (req: Request, res: Response) => {
    res.clearCookie('token')

    return res.status(StatusCodes.OK).json({ msg: 'User logged out!' })
}

export const findAllStudents = async (req: Request, res: Response) => {
    const students = await Student.find({ createdBy: req.params.studentId })

    return res.status(StatusCodes.OK).json(students)
}

export const updateStudent = async (req: Request, res: Response) => {
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

export const deleteStudent = async (req: Request, res: Response) => {
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

