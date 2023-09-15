import Admin from '../models/adminModel'
import { StatusCodes } from 'http-status-codes'
import { Request, Response } from 'express'
import customApiErrors from '../errors/customApiErrors'
import { createJwt, setResponseCookie } from '../utils/jwtUtils'


const register = async (req: Request, res: Response) => {
	if (req.body.key !== process.env.CREATE_ADMIN_KEY) {
		throw new customApiErrors.UnauthorizedError('Invalid admin key')
	}

	const admin = await Admin.create(req.body)

	return res.status(StatusCodes.CREATED).json({ admin: { _id: admin._id, name: admin.name, role: 'admin' } })
}

const login = async (req: Request, res: Response) => {
	const { email, password } = req.body
	if (!email || !password) {
		throw new customApiErrors.BadRequestError('Please provide email and password')
	}

	const admin = await Admin.findOne({ email })
	if (!admin) {
		throw new customApiErrors.UnauthenticatedError('Invalid Credentials')
	}

	const isPasswordCorrect = await admin.comparePassword(password)
	if (!isPasswordCorrect) {
		throw new customApiErrors.UnauthenticatedError('Invalid Credentials')
	}

	const token = createJwt(admin, 'admin')
	setResponseCookie(token, res)

	return res.status(StatusCodes.OK).json({ admin: { _id: admin._id, name: admin.name, role: 'admin' }, msg: 'Logged in successfully' })
}

export const logout = async (req: Request, res: Response) => {
	res.clearCookie('token')

	return res.status(StatusCodes.OK).json({ msg: 'User logged out!' })
}

const findAll = async (req: Request, res: Response) => {
	const admins = await Admin.find({}).select('-password')

	return res.status(StatusCodes.OK).json({ admins })
}

const findById = async (req: Request, res: Response) => {
	const admin = await Admin.findById(req.params.id).select('-password')
	if (!admin) {
		throw new customApiErrors.NotFoundError(`No item found with _id: ${req.params.id}`)
	}
	return res.status(StatusCodes.OK).json({ admin })
}

const updateId = async (req: Request, res: Response) => {
	const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password')
	if (!updatedAdmin) {
		throw new customApiErrors.NotFoundError(`No item found with _id: ${req.params.id}`)
	}
	return res.status(StatusCodes.OK).json({ updatedAdmin })
}

const deleteId = async (req: Request, res: Response) => {
	const admin = await Admin.findByIdAndRemove(req.params.id)
	if (!admin) {
		throw new customApiErrors.NotFoundError(`No item found with _id: ${req.params.id}`)
	}
	return res.status(StatusCodes.OK).json({ msg: 'Admin deleted successfully' })
}


const adminController = { register, login, logout, findAll, findById, updateId, deleteId }

export default adminController