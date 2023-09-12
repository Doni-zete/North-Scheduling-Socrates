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

const updateAppointmentsByInstructorId = async (req: Request, res: Response) => {	
	if (req.user.role === 'instructor' && req.params.instructorId !== req.user.id) {
		throw new customApiErrors.UnauthorizedError('You can not update a appointment of others instructors!')
	}
	
	if (Object.keys(req.body).length === 0 ) {
		throw new customApiErrors.BadRequestError('Please provide properties to update')
	}

	if (req.user.role === 'admin') {
		const appointment = await Appointment.findOneAndUpdate({ instructorId: req.params.instructorId, _id: req.params.id }, req.body, { new: true, runValidators: true })
		if (!appointment) {
			throw new customApiErrors.NotFoundError(`No item found with _id: ${req.params.id}`)
		}
	
		return res.status(StatusCodes.OK).json({ appointment })
	}

	const appointment = await Appointment.findOneAndUpdate({ instructorId: req.params.instructorId, _id: req.params.id }, req.body, { new: true, runValidators: true })
	if (!appointment) {
		throw new customApiErrors.NotFoundError(`No item found with _id: ${req.params.id}`)
	}

	return res.status(StatusCodes.OK).json({ appointment })
}



const deleteAppointmentsByInstructorId = async (req: Request, res: Response) => {	
	if (req.user.role === 'instructor' && req.params.instructorId !== req.user.id) {
		throw new customApiErrors.UnauthorizedError('You can not delete a appointment of others instructors!')
	}
	
	if (req.user.role === 'admin') {
		const appointment = await Appointment.findOneAndDelete({ instructorId: req.params.instructorId, _id: req.params.id }, req.body)
		if (!appointment) {
			throw new customApiErrors.NotFoundError(`No item found with _id: ${req.params.id}`)
		}
	
		return res.status(StatusCodes.OK).json({ msg: 'Appointment deleted successfully' })
	}

	const appointment = await Appointment.findOneAndDelete({ instructorId: req.params.instructorId, _id: req.params.id }, req.body)
	if (!appointment) {
		throw new customApiErrors.NotFoundError(`No item found with _id: ${req.params.id}`)
	}

	return res.status(StatusCodes.OK).json({ msg: 'Appointment deleted successfully' })	
}


const appointmentController = { create, findAll, findById, findAppointmentsByInstructorId, findAppointmentsByStudentId, updateAppointmentsByInstructorId, deleteAppointmentsByInstructorId }

export default appointmentController