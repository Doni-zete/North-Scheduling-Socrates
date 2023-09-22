import Availability from '../models/availabilityModel'
import { StatusCodes } from 'http-status-codes'
import { Request, Response } from 'express'
import customApiErrors from '../errors/customApiErrors'
import Instructor from '../models/instructorModel'


const create = async (req: Request, res: Response) => {
	if ((req.user.role !== 'admin') && (req.user.id !== req.body.instructorId)) {
		throw new customApiErrors.UnauthorizedError('You only can post your instructorId')
	}

	const instructorExists = await Instructor.findById(req.body.instructorId)
	if (!instructorExists) {
		throw new customApiErrors.BadRequestError('instructorId does not exists')
	}

	for (let i = 0; i < req.body.hours.length; i++) {
		const currentHour = new Date(req.body.date + 'T' + req.body.hours[i])
		if (!(currentHour instanceof Date)) {
			throw new customApiErrors.BadRequestError('Invalid date or hours')
		}

		if (currentHour < new Date()) {
			throw new customApiErrors.BadRequestError('Invalid date, your date is lower than now')
		}
	}

	const availabilityExists = await Availability.findOne({ instructorId: req.body.instructorId, date: req.body.date })
	if (availabilityExists) {
		throw new customApiErrors.CustomApiError('This availability already exists', 409)
	}

	const availability = await Availability.create(req.body)
	return res.status(StatusCodes.CREATED).json({ availability })
}

const findAll = async (req: Request, res: Response) => {
	const availabilitys = await Availability.find({})
	return res.status(StatusCodes.OK).json({ availabilitys })
}

const findById = async (req: Request, res: Response) => {
	const availability = await Availability.findById(req.params.id)
	if (!availability) {
		throw new customApiErrors.NotFoundError(`No item found with _id: ${req.params.id}`)
	}

	return res.status(StatusCodes.OK).json({ availability })
}

const findAvailabilitysByInstructorId = async (req: Request, res: Response) => {
	const availability = await Availability.find({ instructorId: req.params.id })
	if (!availability || availability.length === 0) {
		throw new customApiErrors.NotFoundError(`No item found with _id: ${req.params.id}`)
	}

	return res.status(StatusCodes.OK).json({ availability })
}

const updateAvailabilityByInstructorId = async (req: Request, res: Response) => {
	if (req.user.role === 'instructor' && req.params.instructorId !== req.user.id) {
		throw new customApiErrors.UnauthorizedError('You can not update a availability of others instructors!')
	}

	if (Object.keys(req.body).length === 0 ) {
		throw new customApiErrors.BadRequestError('Please provide properties to update')
	}

	for (let i = 0; i < req.body.hours.length; i++) {
		const currentHour = new Date(req.body.date + 'T' + req.body.hours[i])
		if (!(currentHour instanceof Date)) {
			throw new customApiErrors.BadRequestError('Invalid date or hours')
		}

		if (currentHour < new Date()) {
			throw new customApiErrors.BadRequestError('Invalid date, your date is lower than now')
		}
	}
	
	if (req.user.role === 'admin') {
		const availability = await Availability.findOneAndUpdate({ instructorId: req.params.instructorId, _id: req.params.id }, req.body, { new: true, runValidators: true })
		if (!availability) {
			throw new customApiErrors.NotFoundError(`No item found with _id: ${req.params.id}`)
		}
	
		return res.status(StatusCodes.OK).json({ availability })
	}

	const availability = await Availability.findOneAndUpdate({ instructorId: req.params.instructorId, _id: req.params.id }, req.body, { new: true, runValidators: true })
	if (!availability) {
		throw new customApiErrors.NotFoundError(`No item found with _id: ${req.params.id}`)
	}

	return res.status(StatusCodes.OK).json({ availability })
}

const deleteAvailabilityByInstructorId = async (req: Request, res: Response) => {	
	if (req.user.role === 'instructor' && req.params.instructorId !== req.user.id) {
		throw new customApiErrors.UnauthorizedError('You can not delete a availability of others instructors!')
	}
	
	if (req.user.role === 'admin') {
		const availability = await Availability.findOneAndDelete({ instructorId: req.params.instructorId, _id: req.params.id }, req.body)
		if (!availability) {
			throw new customApiErrors.NotFoundError(`No item found with _id: ${req.params.id}`)
		}
	
		return res.status(StatusCodes.OK).json({ msg: 'Availability deleted successfully' })
	}

	const availability = await Availability.findOneAndDelete({ instructorId: req.params.instructorId, _id: req.params.id }, req.body)
	if (!availability) {
		throw new customApiErrors.NotFoundError(`No item found with _id: ${req.params.id}`)
	}

	return res.status(StatusCodes.OK).json({ msg: 'Availability deleted successfully' })	
}


const availabilityController = { create, findAll, findById, findAvailabilitysByInstructorId, updateAvailabilityByInstructorId, deleteAvailabilityByInstructorId }

export default availabilityController