import { Request, Response } from 'express'
import availabilityController from '../../controllers/availabilityController'
import Availability from '../../models/availabilityModel'
import { StatusCodes } from 'http-status-codes'

jest.mock('../../models/availabilityModel', () => ({
	findById: jest.fn(),
}))

describe('Availability Controller', () => {
	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should successfully find an availability by ID', async () => {
		const req = {
			params: { id: 'availabilityId1' },
		} as unknown as Request
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as unknown as Response

		const mockAvailability = {
			_id: 'availabilityId1',
			instructorId: 'instructorId1',
			date: '2023-09-25',
			hours: ['09:00', '10:00'],
		};

		(Availability.findById as jest.Mock).mockReturnValue(mockAvailability)

		await availabilityController.findById(req, res)

		expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
		expect(res.json).toHaveBeenCalledWith({ availability: mockAvailability })
		expect(Availability.findById).toHaveBeenCalledWith('availabilityId1')
	})
})