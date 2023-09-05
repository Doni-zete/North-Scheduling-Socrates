import Instructor from '../models/instructorModel'
import { StatusCodes } from 'http-status-codes'
import { Request, Response } from 'express'
import customApiErrors from '../errors/customApiErrors'
import { createJwt, setResponseCookie } from '../utils/jwtUtils'
import Appointment from '../models/appointmentModel'


const register = async (req: Request, res: Response) => {
	const instructor = await Instructor.create(req.body)

	return res.status(StatusCodes.CREATED).json({ instructor: { _id: instructor._id, name: instructor.name, role: 'instructor' } })
}

const login = async (req: Request, res: Response) => {
	const { email, password } = req.body
	if (!email || !password) {
		throw new customApiErrors.BadRequestError('Please provide email and password')
	}

	const instructor = await Instructor.findOne({ email })
	if (!instructor) {
		throw new customApiErrors.UnauthenticatedError('Invalid Credentials')
	}

	const isPasswordCorrect = await instructor.comparePassword(password)
	if (!isPasswordCorrect) {
		throw new customApiErrors.UnauthenticatedError('Invalid Credentials')
	}

	const token = createJwt(instructor, 'instructor')
	setResponseCookie(token, res)

	return res.status(StatusCodes.OK).json({ instructor: { _id: instructor._id, name: instructor.name, role: 'instructor' }, msg: 'Logged in successfully' })
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
	if ((req.user.role !== 'admin') && (req.user.id !== req.params.id)) {
		throw new customApiErrors.UnauthorizedError('Invalid id request, you only can get your id')
	}

	const instructor = await Instructor.findById(req.params.id)
	if (!instructor) {
		throw new customApiErrors.NotFoundError(`No item found with _id: ${req.params.id}`)
	}
	return res.status(StatusCodes.OK).json({ instructor })
}

const findAppointmentsByInstructorId = async (req: Request, res: Response) => {
	if ((req.user.role !== 'admin') && (req.user.id !== req.params.id)) {
		throw new customApiErrors.UnauthorizedError('Invalid id request, you only can get your id')
	}

	const appointment = await Appointment.find({ instructorId: req.params.id })
	if (!appointment) {
		throw new customApiErrors.NotFoundError(`No item found with _id: ${req.params.id}`)
	}
	return res.status(StatusCodes.OK).json({ appointment })
}

const updateId = async (req: Request, res: Response) => {
	if ((req.user.role !== 'admin') && (req.user.id !== req.params.id)) {
		throw new customApiErrors.UnauthorizedError('Invalid id request, you only can update your id')
	}

	const updatedInstructor = await Instructor.findByIdAndUpdate(req.params.id, req.body, { new: true })
	if (!updatedInstructor) {
		throw new customApiErrors.NotFoundError(`No item found with _id: ${req.params.id}`)
	}
	return res.status(StatusCodes.OK).json({ updatedInstructor })
}

const deleteId = async (req: Request, res: Response) => {
	if ((req.user.role !== 'admin') && (req.user.id !== req.params.id)) {
		throw new customApiErrors.UnauthorizedError('Invalid id request, you only can delete your id')
	}

	const instructor = await Instructor.findByIdAndRemove(req.params.id)
	if (!instructor) {
		throw new customApiErrors.NotFoundError(`No item found with _id: ${req.params.id}`)
	}
	return res.status(StatusCodes.OK).json({ msg: 'Instructor deleted successfully' })
}


const instructorController = { register, login, logout, findAll, findById, findAppointmentsByInstructorId, updateId, deleteId }

export default instructorController