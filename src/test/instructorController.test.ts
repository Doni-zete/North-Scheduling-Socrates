import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import instructorController from '../controllers/instructorController'
import Instructor from '../models/instructorModel'


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


