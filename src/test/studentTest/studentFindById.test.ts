import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import studentController from '../../controllers/studentController'
import Student from '../../models/studentModel'
import dotenv from 'dotenv'
dotenv.config()

jest.mock('../../models/studentModel', () => ({
	findById: jest.fn()
}))

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

		await studentController.findById(req, res)

		expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
		expect(res.json).toHaveBeenCalledWith({
			student: mockedStudent
		})

		expect(Student.findById).toHaveBeenCalledWith('studentId')

		expect((Student.findById as jest.Mock).mock.results[0].value.select).toHaveBeenCalledWith('-password')
	})
})