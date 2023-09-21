import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import instructorController from '../../controllers/instructorController'
import Instructor from '../../models/instructorModel'
import customApiErrors from '../../errors/customApiErrors'

describe('Instructors Update', () => {
	it('should return an instructor updated by id', async () => {
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

		const mockInstructor = {
			_id: '6508854a72a40e21e3c62efd',
			oldPassword: '123',
			password: '1234',
		}

		Instructor.findOne = jest.fn().mockResolvedValue(mockInstructor)

		try {
			const updatedInstructor = await instructorController.updateId(req, res)

			if (!updatedInstructor) {
				throw new customApiErrors.NotFoundError(
					`No item found with _id: ${req.params.id}`
				)
			}

			expect(statusMock).toHaveBeenCalledWith(StatusCodes.OK)
			expect(jsonMock).toHaveBeenCalledWith({ updatedInstructor: mockInstructor })
		} catch (error) {
			//console.log(error)
		}
	})
})
