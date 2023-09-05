import Instructor from '../models/instructorModel'
import Appointment from '../models/appointmentModel'
import { StatusCodes } from 'http-status-codes'
import { Request, Response } from 'express'
import customApiErrors from '../errors/customApiErrors'
import AppointmentDocument from '../models/appointmentDocument'


const create = async (req: Request, res: Response) => {
	const instructor = await Instructor.findById(req.body.instructorId)
	if (!instructor) {
		throw new customApiErrors.BadRequestError('Instructor id not found!')
	}

	const availabilitySchedule = instructor.availabilitySchedule
	for (let i = 0; i < availabilitySchedule.length; i++) {
		const instructorCurrentDate = availabilitySchedule[i].date
		const instructorCurrentHours = availabilitySchedule[i].availableHours

		if (instructorCurrentDate === req.body.date && instructorCurrentHours.includes(req.body.hour)) {
			const appointment = await Appointment.create(req.body)

			const updatedAvailableHours = instructorCurrentHours.filter(item => item !== req.body.hour)
			availabilitySchedule[i].availableHours = updatedAvailableHours
			await instructor.updateOne({ availabilitySchedule })

			return res.status(StatusCodes.CREATED).json({ appointment })
		}
	}

	throw new customApiErrors.CustomApiError('Instructor unavailable, date or hour invalid', 409)
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
	let updatedAppointment: AppointmentDocument | null = null

	if (req.user.role === 'student') {
		updatedAppointment = await Appointment.findOneAndUpdate({ _id: req.params.id, studentId: req.user.id }, req.body, { new: true })
	}

	if (req.user.role === 'instructor') {
		updatedAppointment = await Appointment.findOneAndUpdate({ _id: req.params.id, instructorId: req.user.id }, req.body, { new: true })
	}

	if ((req.user.role === 'admin')) {
		updatedAppointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true })
	}

	if (!updatedAppointment) {
		throw new customApiErrors.NotFoundError(`No item found with _id: ${req.params.id} in yours appointments`)
	}

	return res.status(StatusCodes.OK).json({ updatedAppointment })
}

const deleteId = async (req: Request, res: Response) => {
	let deletedAppointment: AppointmentDocument | null = null

	if (req.user.role === 'student') {
		deletedAppointment = await Appointment.findOneAndDelete({ _id: req.params.id, studentId: req.user.id })
	}

	if (req.user.role === 'instructor') {
		deletedAppointment = await Appointment.findOneAndDelete({ _id: req.params.id, instructorId: req.user.id })
	}

	if ((req.user.role === 'admin')) {
		deletedAppointment = await Appointment.findByIdAndDelete(req.params.id)
	}

	if (!deletedAppointment) {
		throw new customApiErrors.NotFoundError(`No item found with _id: ${req.params.id} in yours appointments`)
	}

	return res.status(StatusCodes.OK).json({ deletedAppointment })
}


const appointmentController = { create, findAll, findById, updateId, deleteId }

export default appointmentController