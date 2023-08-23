import Student from '../models/studentModel'
import { Request, Response } from "express"
import { StatusCodes } from 'http-status-codes'

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