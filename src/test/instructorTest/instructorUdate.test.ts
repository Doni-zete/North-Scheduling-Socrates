import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import instructorController from '../../controllers/instructorController'
import Instructor from '../../models/instructorModel'

jest.mock('../../models/instructorModel', () => ({
	findByIdAndUpdate: jest.fn()
}))

describe('Instructors Update', () => {

	it('should return an instructor updated by id', async () => {

		const req = {
			user: { role: 'admin', id: '6508854a72a40e21e3c62efd' },
			params: { id: '6508854a72a40e21e3c62efd' },
			body: {
				oldPassword: '123',
				password: '1234',
			},
		} as unknown as Request

		const jsonMock = jest.fn()
		const statusMock = jest.fn().mockReturnValue({ json: jsonMock })

		const res: Response = {
			status: statusMock,
		} as unknown as Response

		const mockInstructor = {
			_id: '6508854a72a40e21e3c62efd',
			oldPassword: '123',
			password: '1234',
		};

		(Instructor.findByIdAndUpdate as jest.Mock).mockReturnValue({
			select: jest.fn().mockResolvedValue(mockInstructor)
		})

		await instructorController.updateId(req, res)

		expect(statusMock).toHaveBeenCalledWith(StatusCodes.OK)

		expect(jsonMock).toHaveBeenCalledWith({ updatedInstructor: mockInstructor, })

	})

})