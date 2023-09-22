import Student from '../models/studentModel'
import { StatusCodes } from 'http-status-codes'
import { Request, Response } from 'express'
import customApiErrors from '../errors/customApiErrors'
import { createJwt, setResponseCookie } from '../utils/jwtUtils'
import Appointment from '../models/appointmentModel'


const register = async (req: Request, res: Response) => {
	const student = await Student.create(req.body)

	return res.status(StatusCodes.CREATED).json({ student: { _id: student._id, name: student.name, role: 'student' } })
}

const login = async (req: Request, res: Response) => {
	const { email, password } = req.body
	if (!email || !password) {
		throw new customApiErrors.BadRequestError('Please provide valid payload')
	}

	const student = await Student.findOne({ email })
	if (!student) {
		throw new customApiErrors.UnauthenticatedError('Invalid Credentials')
	}

	const isPasswordCorrect = await student.comparePassword(password)
	if (!isPasswordCorrect) {
		throw new customApiErrors.UnauthenticatedError('Invalid Credentials')
	}

	const token = createJwt(student, 'student')
	setResponseCookie(token, res)

	return res.status(StatusCodes.OK).json({ student: { _id: student._id, name: student.name, role: 'student' }, msg: 'Logged in successfully' })
}

const findAll = async (req: Request, res: Response) => {
	const students = await Student.find({}).select('-password')

	return res.status(StatusCodes.OK).json({ students })
}

const findById = async (req: Request, res: Response) => {
	if ((req.user.role !== 'admin') && (req.user.id !== req.params.id)) {
		throw new customApiErrors.UnauthorizedError('Invalid id request, you only can get your id')
	}

	const student = await Student.findById(req.params.id).select('-password')
	if (!student) {
		throw new customApiErrors.NotFoundError(`No item found with _id: ${req.params.id}`)
	}
	return res.status(StatusCodes.OK).json({ student })
}

const findAppointmentsByStudentId = async (req: Request, res: Response) => {
	if ((req.user.role !== 'admin') && (req.user.id !== req.params.id)) {
		throw new customApiErrors.UnauthorizedError('Invalid id request, you only can get your id')
	}

	const appointment = await Appointment.find({ studentId: req.params.id }).select('-password')
	if (!appointment) {
		throw new customApiErrors.NotFoundError(`No item found with _id: ${req.params.id}`)
	}
	return res.status(StatusCodes.OK).json({ appointment })
}

const updateId = async (req: Request, res: Response) => {
	if ((req.user.role !== 'admin') && (req.user.id !== req.params.id)) {
		throw new customApiErrors.UnauthorizedError('Invalid id request, you only can update your id')
	}

	const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password')
	if (!updatedStudent) {
		throw new customApiErrors.NotFoundError(`No item found with _id: ${req.params.id}`)
	}
	return res.status(StatusCodes.OK).json({ updatedStudent })
}

const deleteId = async (req: Request, res: Response) => {
	if ((req.user.role !== 'admin') && (req.user.id !== req.params.id)) {
		throw new customApiErrors.UnauthorizedError('Invalid id request, you only can delete your id')
	}

	const student = await Student.findByIdAndRemove(req.params.id)
	if (!student) {
		throw new customApiErrors.NotFoundError(`No item found with _id: ${req.params.id}`)
	}
	return res.status(StatusCodes.OK).json({ msg: 'Student deleted successfully' })
}


const studentController = { register, login, findAll, findAppointmentsByStudentId, findById, updateId, deleteId }

export default studentController