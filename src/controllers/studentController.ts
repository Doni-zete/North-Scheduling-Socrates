import Student from '../models/studentModel'
import { Request, Response } from "express"
import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose';
import customApiErrors from '../errors/customApiErrors';


export const registerStudent = async (req: Request, res: Response) => {
    const { name, email, password, schooling } = req.body

    if(!name || !email || !password || !schooling){
        throw new customApiErrors.BadRequestError('Please provide valid payload.')
    }

    const students = await Student.create(name, email, password, schooling)
    return res.status(StatusCodes.CREATED).json(students)
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

