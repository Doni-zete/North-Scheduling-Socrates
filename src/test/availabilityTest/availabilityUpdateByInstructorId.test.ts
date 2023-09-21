import { Request, Response } from 'express'
import availabilityController from '../../controllers/availabilityController'
import Availability from '../../models/availabilityModel'
import { StatusCodes } from 'http-status-codes'

jest.mock('../../models/availabilityModel', () => ({
	findOneAndUpdate: jest.fn(),
}))

describe('Availability Controller', () => {
	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should successfully update availability by instructor ID and availability ID', async () => {
		const req = {
			user: { role: 'admin' },
			params: { instructorId: 'instructorId1', id: 'availabilityId1' },
			body: {
				date: '2023-09-25',
				hours: ['09:00', '10:00'],
			},
		} as unknown as Request
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as unknown as Response

		const mockUpdatedAvailability = {
			_id: 'availabilityId1',
			instructorId: 'instructorId1',
			date: '2023-09-25',
			hours: ['09:00', '10:00'],
		};

		(Availability.findOneAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedAvailability)

		await availabilityController.updateAvailabilityByInstructorId(req, res)

		expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
		expect(res.json).toHaveBeenCalledWith({ availability: mockUpdatedAvailability })
		expect(Availability.findOneAndUpdate).toHaveBeenCalledWith(
			{ instructorId: 'instructorId1', _id: 'availabilityId1' },
			{
				date: '2023-09-25',
				hours: ['09:00', '10:00'],
			},
			{ new: true, runValidators: true }
		)
	})
})