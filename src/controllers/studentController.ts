import Student from '../models/studentModel'
import { Request, Response } from "express"
import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose';


export const createStudent = async (req: Request, res: Response) => {
    const studentData = {
        ...req.body,
    };
    const students = await Student.create(studentData)
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



