import Instructor from '../models/instructorModel'
import Appointment from '../models/appointmentModel'
import { StatusCodes } from 'http-status-codes'
import { Request, Response } from 'express'
import customApiErrors from '../errors/customApiErrors'
import Availability from '../models/availabilityModel'


const create = async (req: Request, res: Response) => {
	if ((req.user.role !== 'admin') && (req.user.id !== req.body.studentId)) {
		throw new customApiErrors.UnauthorizedError('You only can post your studentId')
	}

	const instructorExists = await Instructor.findById(req.body.instructorId)
	if (!instructorExists) {
		throw new customApiErrors.BadRequestError('instructorId does not exists')
	}

	const instructorAvailability = await Availability.findOne({ instructorId: req.body.instructorId, date: req.body.date })
	if (!instructorAvailability || !instructorAvailability.hours.includes(req.body.hour)) {
		throw new customApiErrors.BadRequestError('Instructor is not available in this date')
	}

	const appointment = await Appointment.create(req.body)
	instructorAvailability.hours = instructorAvailability.hours.filter(item => item !== req.body.hour)
	await instructorAvailability.save()
	return res.status(StatusCodes.CREATED).json({ appointment })
}

const findAll = async (req: Request, res: Response) => {
	const appointments = await Appointment.find({})

	return res.status(StatusCodes.OK).json({ appointments })
}

const findById = async (req: Request, res: Response) => {
	const appointment = await Appointment.findById(req.params.id)
	if (!appointment) {
		throw new customApiErrors.NotFoundError(`No item found with _id: ${req.params.id}`)
	}

	return res.status(StatusCodes.OK).json({ appointment })
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

const findAppointmentsByStudentId = async (req: Request, res: Response) => {
	if ((req.user.role !== 'admin') && (req.user.id !== req.params.id)) {
		throw new customApiErrors.UnauthorizedError('Invalid id request, you only can get your id')
	}

	const appointment = await Appointment.find({ studentId: req.params.id })
	if (!appointment) {
		throw new customApiErrors.NotFoundError(`No item found with _id: ${req.params.id}`)
	}
	return res.status(StatusCodes.OK).json({ appointment })
}

const updateId = async (req: Request, res: Response) => {
	const updatedAppointment = await Appointment.findByIdAndUpdate(req.body.id, req.body, { new: true })
	if (!updatedAppointment) {
		throw new customApiErrors.NotFoundError(`No item found with _id: ${req.params.id}`)
	}

	return res.status(StatusCodes.OK).json({ updatedAppointment })
}

const updateAppointmentsByInstructorId = async (req: Request, res: Response) => {
	if ((req.user.role !== 'admin') && (req.user.id !== req.params.instructorId)) {
		throw new customApiErrors.UnauthorizedError('Invalid id request, you only can update your instructorId')
	}

	if (Object.keys(req.body).length === 0 ) {
		throw new customApiErrors.BadRequestError('Please provide properties to update')
	}

	const appointment = await Appointment.findOneAndUpdate({ instructorId: req.params.instructorId, _id: req.params.id }, req.body, { new: true })
	if (!appointment) {
		throw new customApiErrors.NotFoundError(`No item found with _id: ${req.params.id}`)
	}

	return res.status(StatusCodes.OK).json({ appointment })
}

const updateAppointmentsByStudentId = async (req: Request, res: Response) => {
	if ((req.user.role !== 'admin') && (req.user.id !== req.params.studentId)) {
		throw new customApiErrors.UnauthorizedError('Invalid id request, you only can update your studentId')
	}

	if (Object.keys(req.body).length === 0 ) {
		throw new customApiErrors.BadRequestError('Please provide properties to update')
	}

	const appointment = await Appointment.findOneAndUpdate({ studentId: req.params.studentId, _id: req.params.id }, req.body, { new: true })
	if (!appointment) {
		throw new customApiErrors.NotFoundError(`No item found with _id: ${req.params.id}`)
	}
	
	return res.status(StatusCodes.OK).json({ appointment })
}

const deleteId = async (req: Request, res: Response) => {
	const deletedAppointment = await Appointment.findByIdAndDelete(req.body.id)
	if (!deletedAppointment) {
		throw new customApiErrors.NotFoundError(`No item found with _id: ${req.params.id}`)
	}

	return res.status(StatusCodes.OK).json({ msg: 'Appointment deleted successfully' })
}


const appointmentController = { create, findAll, findById, findAppointmentsByInstructorId, findAppointmentsByStudentId, updateId, updateAppointmentsByInstructorId, updateAppointmentsByStudentId, deleteId }

export default appointmentController