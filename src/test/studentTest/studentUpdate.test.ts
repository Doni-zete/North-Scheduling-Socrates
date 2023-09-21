import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import studentController from '../../controllers/studentController'
import Student from '../../models/studentModel'
import customApiErrors from '../../errors/customApiErrors'
import dotenv from 'dotenv'
dotenv.config()

jest.mock('../../models/studentModel', () => ({
	findOne: jest.fn()
}))

describe('Students Update', () => {
	it('should return an student updated by id', async () => {
		const req = {
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
			_id: '6508854a72a40e21e3c62efd',
			oldPassword: '123',
			password: '1234',
		}

		Student.findOne = jest.fn().mockResolvedValue(mockStudent)

		try {
			const updatedStudent = await studentController.updateId(req, res)

			if (!updatedStudent) {
				throw new customApiErrors.NotFoundError(
					`No item found with _id: ${req.params.id}`
				)
			}

			expect(statusMock).toHaveBeenCalledWith(StatusCodes.OK)
			expect(jsonMock).toHaveBeenCalledWith({ updatedStudent: mockStudent })
		} catch (error) {
			//console.log(error)
		}
	})
})
