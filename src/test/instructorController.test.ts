import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import instructorController from '../controllers/instructorController'
import Instructor from '../models/instructorModel'
import dotenv from 'dotenv'
dotenv.config()

jest.mock('../models/instructorModel', () => ({
	create: jest.fn(),
	findOne: jest.fn(),
	comparePassword: jest.fn(),
}))

describe('Instructor Registration', () => {
	it('should successfully register an instructor', async () => {
		const req = {} as Request
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as unknown as Response

		const instructorData = { name: 'Maria' }

		const mockedInstructor = {
			_id: 'mockedId',
			name: instructorData.name,
			role: 'instructor',
		};
		(Instructor.create as jest.Mock).mockResolvedValue(mockedInstructor)

		await instructorController.register(req, res)

		expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED)
		expect(res.json).toHaveBeenCalledWith({
			instructor: mockedInstructor,
		})
		expect(Instructor.create).toHaveBeenCalledWith(req.body)
	})
})


describe('Instructor Login', () => {
	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should successfully login an instructor', async () => {
		const req = {
			body: {
				email: 'maria@email.com',
				password: 'password123',
			},
		} as Request

		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
			cookie: jest.fn(),
		} as unknown as Response

		const mockedInstructor = {
			_id: 'mockedId',
			name: 'Maria',
			role: 'instructor',
			comparePassword: jest.fn().mockResolvedValue(true),
		}

			; (Instructor.findOne as jest.Mock).mockResolvedValue(mockedInstructor)

		await instructorController.login(req, res)

		expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
		expect(res.json).toBeCalledWith({
			instructor: {
				_id: mockedInstructor._id,
				name: mockedInstructor.name,
				role: mockedInstructor.role,
			},
			msg: 'Logged in successfully',
		})

		expect(Instructor.findOne).toHaveBeenCalledWith({ email: req.body.email })
	})


})

