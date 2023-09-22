import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import studentController from '../../controllers/studentController'
import Student from '../../models/studentModel'
import dotenv from 'dotenv'
dotenv.config()

jest.mock('../../models/studentModel', () => ({
	findByIdAndRemove: jest.fn()
}))

describe('Delete Student', () => {
	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should successfully delete a student', async () => {
		const req = {
			user: { role: 'admin', id: 'adminId'},
			params: { id: 'studentId' }
		} as unknown as Request
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn()
		} as unknown as Response

		(Student.findByIdAndRemove as jest.Mock).mockResolvedValue({})

		await studentController.deleteId(req, res)

		expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
		expect(res.json).toHaveBeenCalledWith({ msg: 'Student deleted successfully'})
		expect(Student.findByIdAndRemove).toHaveBeenCalledWith(req.params.id)
	})
})
