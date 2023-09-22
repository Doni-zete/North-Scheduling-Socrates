import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import studentController from '../../controllers/studentController'
import Student from '../../models/studentModel'
import dotenv from 'dotenv'
dotenv.config()

jest.mock('../../models/studentModel', () => ({
	create: jest.fn(),
	findOne: jest.fn(),
	comparePassword: jest.fn(),
}))

describe('Students Registration', () => {
	it('should successfully create a student', async () => {
		const req = {} as Request
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as unknown as Response

		const studentData = { name: 'João' }

		const mockedStudent = {
			_id: 'mockedId',
			name: studentData.name,
			role: 'student',
		};
		(Student.create as jest.Mock).mockResolvedValue(mockedStudent)

		await studentController.register(req, res)

		expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED)
		expect(res.json).toHaveBeenCalledWith({
			student: mockedStudent,
		})
		expect(Student.create).toHaveBeenCalledWith(req.body)
	})
})

describe('Students Login', () => {
	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should successfully login a student', async () => {
		const req = {
			body: {
				email: 'joao@email.com',
				password: 'password123',
			},
		} as Request

		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
			cookie: jest.fn()
		} as unknown as Response

		const mockedStudent = {
			_id: 'mockedId',
			name: 'João',
			role: 'student',
			comparePassword: jest.fn().mockResolvedValue(true),
		};

		(Student.findOne as jest.Mock).mockResolvedValue(mockedStudent)

		await studentController.login(req, res)

		expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
		expect(res.json).toBeCalledWith({
			student: {
				_id: mockedStudent._id,
				name: mockedStudent.name,
				role: mockedStudent.role,
			},
			msg: 'Logged in successfully',
		})

		expect(Student.findOne).toHaveBeenCalledWith({ email: req.body.email })

	})
})