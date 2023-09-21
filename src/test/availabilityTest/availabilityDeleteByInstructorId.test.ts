import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import availabilityController from '../../controllers/availabilityController'
import Availability from '../../models/availabilityModel'
import customApiErrors from '../../errors/customApiErrors'

jest.mock('../../models/availabilityModel', () => ({
	findOneAndDelete: jest.fn(),
}))

describe('Availability Controller - deleteAvailabilityByInstructorId', () => {
	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should successfully delete availability', async () => {
		const req: Request = {
			user: { role: 'admin' },
			params: { instructorId: 'instructorId', id: 'availabilityId' },
		} as unknown as Request
    
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as unknown as Response
    
		(Availability.findOneAndDelete as jest.Mock).mockResolvedValue({
			_id: 'availabilityId',
			instructorId: 'instructorId',
		})
    
		await availabilityController.deleteAvailabilityByInstructorId(req, res)
    
		expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
		expect(res.json).toHaveBeenCalledWith({ msg: 'Availability deleted successfully' })
		expect(Availability.findOneAndDelete).toHaveBeenCalledWith({
			instructorId: req.params.instructorId,
			_id: req.params.id,
		})
	})

	it('should handle unauthorized deletion', async () => {
		const req: Request = {
			user: { role: 'instructor', id: 'otherInstructorId' },
			params: { instructorId: 'instructorId', id: 'availabilityId' },
		} as unknown as Request

		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as unknown as Response

		await expect(availabilityController.deleteAvailabilityByInstructorId(req, res)).rejects.toThrow(
			customApiErrors.UnauthorizedError
		)

		expect(res.status).not.toHaveBeenCalled()
		expect(res.json).not.toHaveBeenCalled()
	})

	it('should handle availability not found', async () => {
		const req: Request = {
			user: { role: 'admin' },
			params: { instructorId: 'instructorId', id: 'nonExistentAvailabilityId' },
		} as unknown as Request

		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as unknown as Response

		(Availability.findOneAndDelete as jest.Mock).mockResolvedValue(null)

		await expect(availabilityController.deleteAvailabilityByInstructorId(req, res)).rejects.toThrow(
			customApiErrors.NotFoundError
		)

		expect(res.status).not.toHaveBeenCalled()
		expect(res.json).not.toHaveBeenCalled()
	})
})