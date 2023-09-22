import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import studentController from '../../controllers/studentController'
import Student from '../../models/studentModel'
import dotenv from 'dotenv'
dotenv.config()

jest.mock('../../models/studentModel', () => ({
	find: jest.fn()
}))

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
			{ _id: 'studentId1', name: 'Student 1', role: 'student' },
			{ _id: 'studentId2', name: 'Student 2', role: 'student' }
		];

		(Student.find as jest.Mock).mockReturnValue({
			select: jest.fn().mockResolvedValue(mockedStudents)
		})

		await studentController.findAll(req, res)

		expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
		expect(res.json).toHaveBeenCalledWith({
			students: mockedStudents
		})
		expect(Student.find).toHaveBeenCalledWith({})

		expect((Student.find as jest.Mock).mock.results[0].value.select).toHaveBeenCalledWith('-password')
	})
})