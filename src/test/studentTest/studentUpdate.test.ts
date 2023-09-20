import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import studentController from '../../controllers/studentController'
import Student from '../../models/studentModel'
import dotenv from 'dotenv'
dotenv.config()

jest.mock('../../models/studentModel', () => ({
	findById: jest.fn(),
	findByIdAndUpdate: jest.fn()
}))

describe('Update Student ID', () => {
	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should successfully update student ID for admin', async () => {
		const req = {
			user: { role: 'admin', id: 'adminId' },
			params: { id: 'studentId' },
			body: { email: 'joao@email.com', password: 'password123' }
		} as unknown as Request
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn()
		} as unknown as Response

		const updatedStudentData = { 
			email: 'joao1@email.com',
			password: 'password321'
		};

		(Student.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedStudentData)

		await studentController.updateId(req, res)

		expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
		expect(res.json).toHaveBeenCalledWith({
			updatedStudent: updatedStudentData
		})

		expect(Student.findByIdAndUpdate).toHaveBeenCalledWith(req.params.id, req.body, { new: true })
		expect(Student.findById).toHaveBeenCalledWith(req.params.id)
		expect((Student.findById as jest.Mock).mock.results[0].value.select).toHaveBeenCalledWith('-password')
	})
})