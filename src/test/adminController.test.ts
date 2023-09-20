import { Request, Response } from 'express'
import adminController from '../controllers/adminController'
import Admin from '../models/adminModel'
import { StatusCodes } from 'http-status-codes'
import dotenv from 'dotenv'
dotenv.config()

jest.mock('../models/adminModel', () => ({
	create: jest.fn(),
	findOne: jest.fn(),
	comparePassword: jest.fn(),
}))

describe('Admin Registration', () => {
	it('should successfully register an admin', async () => {
		const req = {
			body: {
				key: process.env.CREATE_ADMIN_KEY,
			},
		} as Request

		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as unknown as Response

		const adminData = { name: 'Mariah' }

		const mockedAdmin = {
			_id: 'mockedId',
			name: adminData.name,
			role: 'admin',
		};
		(Admin.create as jest.Mock).mockResolvedValue(mockedAdmin)

		await adminController.register(req, res)

		expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED)
		expect(res.json).toHaveBeenCalledWith({
			admin: mockedAdmin,
		})
		expect(Admin.create).toHaveBeenCalledWith(req.body)
	})
})


describe('Admin Login', () => {
	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should successfully login an admin', async () => {
		const req = {
			body: {
				email: 'mariah@email.com',
				password: 'password123',
			},
		} as Request

		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
			cookie: jest.fn(),
		} as unknown as Response

		const mockedAdmin = {
			_id: 'mockedId',
			name: 'Mariah',
			role: 'admin',
			comparePassword: jest.fn().mockResolvedValue(true),
		}

			; (Admin.findOne as jest.Mock).mockResolvedValue(mockedAdmin)

		await adminController.login(req, res)

		expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
		expect(res.json).toBeCalledWith({
			admin: {
				_id: mockedAdmin._id,
				name: mockedAdmin.name,
				role: mockedAdmin.role,
			},
			msg: 'Logged in successfully',
		})

		expect(Admin.findOne).toHaveBeenCalledWith({ email: req.body.email })
	})


})