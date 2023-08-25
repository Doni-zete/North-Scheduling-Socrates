import Student from '../models/studentModel'
import { Request, Response } from "express"
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken';
import customApiErrors from '../errors/customApiErrors';
import mongoose from 'mongoose';


export const registerStudent = async (req: Request, res: Response) => {
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

export const findAllStudents = async (req: Request, res: Response) => {
    const students = await Student.find({ createdBy: req.params.studentId })
    res.status(StatusCodes.OK).json(students)

}

export const updateStudent = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const studentData: String = req.body

        if (!mongoose.isValidObjectId(id)) {
            return res.status(StatusCodes.BAD_REQUEST).send({ message: `Id provided is out of standard: ${id}` });
        }
        const updatedStudent = await Student.findByIdAndUpdate(id, studentData, { new: true });

        if (!updatedStudent) {
            return res.status(StatusCodes.NOT_FOUND).send({ message: `Student not found: ${id}` });
        }
        return res.status(StatusCodes.OK).json(updatedStudent);

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Unexpected error, try again ${error}`);
    }
}

export const deleteStudent = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        if (!mongoose.isValidObjectId(id)) {
            return res.status(StatusCodes.BAD_REQUEST).send({ message: `Id provided is out of standard: ${id}` });
        }

        const student = await Student.findByIdAndRemove({
            _id: id
        })
        if (!student) {
            return res.status(StatusCodes.NOT_FOUND).send({ message: `Student not found: ${id}` });
        }
        return res.status(StatusCodes.OK).send({ message: `Student deleted successfully` });

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Unexpected error, try again ${error}`);
    }
}

