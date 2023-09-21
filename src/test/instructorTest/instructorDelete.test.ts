import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import instructorController from '../../controllers/instructorController'
import Instructor from '../../models/instructorModel'

jest.mock('../../models/instructorModel', () => ({
	findByIdAndRemove: jest.fn().mockResolvedValue({}),
}))

describe('Instructors Delete', () => {
	it('should return an instructor delete by id', async () => {
		const req = {
			user: { role: 'admin', id: '6508854a72a40e21e3c62efd' },
			params: { id: '65044bf360353efe5a88c2ab' },
		} as any as Request

		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as any as Response

		await instructorController.deleteId(req, res)

		expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
		expect(res.json).toHaveBeenCalledWith({
			msg: 'Instructor deleted successfully',
		})

		expect(Instructor.findByIdAndRemove).toHaveBeenCalledWith(req.params.id)
	})
})
