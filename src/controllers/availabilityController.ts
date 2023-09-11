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

const updateId = async (req: Request, res: Response) => {
	if (Object.keys(req.body).length === 0 ) {
		throw new customApiErrors.BadRequestError('Please provide properties to update')
	}

	const updatedAvailability = await Availability.findByIdAndUpdate(req.params.id, req.body, { new: true })
	if (!updatedAvailability) {
		throw new customApiErrors.NotFoundError(`No item found with _id: ${req.params.id}`)
	}

	return res.status(StatusCodes.OK).json({ updatedAvailability })
}

const updateAvailabilitysByInstructorId = async (req: Request, res: Response) => {
	if ((req.user.role !== 'admin') && (req.user.id !== req.params.instructorId)) {
		throw new customApiErrors.UnauthorizedError('You only can post your instructorId')
	}

	if (Object.keys(req.body).length === 0 ) {
		throw new customApiErrors.BadRequestError('Please provide properties to update')
	}

	const availability = await Availability.findOneAndUpdate({ instructorId: req.params.instructorId, _id: req.params.id }, req.body)
	if (!availability) {
		throw new customApiErrors.NotFoundError(`No item found with _id: ${req.params.id}`)
	}

	return res.status(StatusCodes.OK).json({ availability })
}

const deleteId = async (req: Request, res: Response) => {
	const deletedAvailability = await Availability.findByIdAndRemove(req.params.id)
	if (!deletedAvailability) {
		throw new customApiErrors.NotFoundError(`No item found with _id: ${req.params.id}`)
	}

	return res.status(StatusCodes.OK).json({ msg: 'Availability deleted successfully' })
}


const availabilityController = { create, findAll, findById, findAvailabilitysByInstructorId, updateId, updateAvailabilitysByInstructorId, deleteId }

export default availabilityController