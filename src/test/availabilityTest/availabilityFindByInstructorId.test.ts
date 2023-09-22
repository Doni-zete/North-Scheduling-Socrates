import { Request, Response } from 'express'
import availabilityController from '../../controllers/availabilityController'
import Availability from '../../models/availabilityModel'
import { StatusCodes } from 'http-status-codes'

jest.mock('../../models/availabilityModel', () => ({
	find: jest.fn(),
}))

describe('Availability Controller', () => {
	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should successfully find availabilities by instructor ID', async () => {
		const req = {
			params: { id: 'instructorId1' },
		} as unknown as Request
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as unknown as Response

		const mockAvailabilities = [
			{
				_id: 'availabilityId1',
				instructorId: 'instructorId1',
				date: '2023-09-25',
				hours: ['09:00', '10:00'],
			},
			{
				_id: 'availabilityId2',
				instructorId: 'instructorId1',
				date: '2023-09-26',
				hours: ['11:00', '12:00'],
			},
		];

		(Availability.find as jest.Mock).mockResolvedValue(mockAvailabilities)

		await availabilityController.findAvailabilitysByInstructorId(req, res)

		expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
		expect(res.json).toHaveBeenCalledWith({ availability: mockAvailabilities })
		expect(Availability.find).toHaveBeenCalledWith({ instructorId: 'instructorId1' })
	})
})