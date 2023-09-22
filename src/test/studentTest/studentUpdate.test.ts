import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import studentController from '../../controllers/studentController'
import Student from '../../models/studentModel'


jest.mock('../../models/studentModel', () => ({
	findByIdAndUpdate: jest.fn()
}))

describe('Students Update', () => {
	it('should return an student updated by id', async () => {
		const req = {
			user: { role: 'student', id: '6500e1b902055bfcc7527f00' },
			params: { id: '6500e1b902055bfcc7527f00' },
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

		const mockStudent = {
			_id: '6500e1b902055bfcc7527f00',
			oldPassword: '123',
			password: '1234',
		};

		(Student.findByIdAndUpdate as jest.Mock).mockReturnValue({
			select: jest.fn().mockResolvedValue(mockStudent)
		})

		await studentController.updateId(req, res)

		expect(statusMock).toHaveBeenCalledWith(StatusCodes.OK)

		expect(jsonMock).toHaveBeenCalledWith({ updatedStudent: mockStudent })
	})
})
