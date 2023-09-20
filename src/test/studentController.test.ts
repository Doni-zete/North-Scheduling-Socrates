import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import studentController from '../controllers/studentController'
import Student from '../models/studentModel'
import dotenv from 'dotenv'
dotenv.config()

jest.mock('../models/studentModel', () => ({
	create: jest.fn(),
	findOne: jest.fn(),
	comparePassword: jest.fn(),
	find: jest.fn(),
	findById: jest.fn(),
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

	it('should successfully login a student',async () => {
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

describe('Should list all students', () => {
	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should successfully get a list of students', async () => {
		const req = {} as Request
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as unknown as Response

		const mockedStudents = [
			{_id: 'studentId1', name: 'Student 1', role: 'student'},
			{_id: 'studentId2', name: 'Student 2', role: 'student'}
		];
    
		(Student.find as jest.Mock).mockReturnValue({
			select: jest.fn().mockResolvedValue(mockedStudents)
		})
    
		await studentController.findAll(req,res)

		expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
		expect(res.json).toHaveBeenCalledWith({
			students: mockedStudents
		})
		expect(Student.find).toHaveBeenCalledWith({})

		expect((Student.find as jest.Mock).mock.results[0].value.select).toHaveBeenCalledWith('-password')
	})
})

describe('Should find a student by ID', () => {
	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should successfully find a student by ID for admin', async () => {
		const req: Request = {
			user: { role: 'admin', id: 'adminId' },
			params: { id: 'studentId' }
		} as unknown as Request
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as unknown as Response

		const mockedStudent = {
			_id: 'studentId',
			name: 'Student 1',
			role: 'student'
		};

		(Student.findById as jest.Mock).mockReturnValue({
			select: jest.fn().mockResolvedValue(mockedStudent)
		})

		await studentController.findById(req,res)

		expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
		expect(res.json).toHaveBeenCalledWith({
			student: mockedStudent
		})

		expect(Student.findById).toHaveBeenCalledWith('studentId')

		expect((Student.findById as jest.Mock).mock.results[0].value.select).toHaveBeenCalledWith('-password')
	})
})