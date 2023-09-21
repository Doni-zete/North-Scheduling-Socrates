import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import instructorController from '../../controllers/instructorController'
import Instructor from '../../models/instructorModel'


describe('Instructors findAll', () => {
	it('should return all instructors', async () => {
		const req = {} as Request
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as any as Response;

		const mockInstructors = [
			{
				_id: '64f36a6ada776022dcf594ba',
				name: 'Azul',
				email: 'azul@gmail.com',
				password: '123',
			},
			{
				_id: '64f36cc5da776022dcf595f8',
				name: 'Laranja',
				email: 'laranja@email.com',
				password: '123',
			},
		]

		const selectMock = jest.fn().mockReturnValue(mockInstructors)
		Instructor.find = jest.fn().mockReturnValue({ select: selectMock })

		await instructorController.findAll(req, res)

		expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
		expect(res.json).toHaveBeenCalledWith({ instructors: mockInstructors })
	})
})