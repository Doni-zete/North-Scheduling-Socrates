import Instructor from '../models/instructorModel'
import Appointment from '../models/appointmentModel'
import { StatusCodes } from 'http-status-codes'
import { Request, Response } from 'express'
import customApiErrors from '../errors/customApiErrors'
import Availability from '../models/availabilityModel'


const create = async (req: Request, res: Response) => {
	const instructorExists = await Instructor.findById(req.body.instructorId)
	if (!instructorExists) {
		throw new customApiErrors.BadRequestError('Invalid instructorId, this instructor dont exists')
	}

	const instructorAvailability = await Availability.findOne({ instructorId: req.body.instructorId, date: req.body.date })
	if (!instructorAvailability || !instructorAvailability.hours.includes(req.body.hour)) {
		throw new customApiErrors.BadRequestError('Instructor is not available in this date')
	}

	instructorAvailability.hours = instructorAvailability.hours.filter(item => item !== req.body.hour)
	await instructorAvailability.save()
	const appointment = await Appointment.create(req.body)
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

const updateId = async (req: Request, res: Response) => {
	const updatedAppointment = await Appointment.findByIdAndUpdate(req.body.id, req.body, { new: true })
	if (!updatedAppointment) {
		throw new customApiErrors.NotFoundError(`No item found with _id: ${req.params.id}`)
	}

	return res.status(StatusCodes.OK).json({ updatedAppointment })
}

const deleteId = async (req: Request, res: Response) => {
	const deletedAppointment = await Appointment.findByIdAndDelete(req.body.id)
	if (!deletedAppointment) {
		throw new customApiErrors.NotFoundError(`No item found with _id: ${req.params.id}`)
	}

	return res.status(StatusCodes.OK).json({ msg: 'Appointment deleted successfully' })
}


const appointmentController = { create, findAll, findById, updateId, deleteId }

export default appointmentController