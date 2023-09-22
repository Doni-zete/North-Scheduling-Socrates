import {Request, Response} from 'express'
import availabilityController from '../../controllers/availabilityController'
import Availability from '../../models/availabilityModel'
import Instructor from '../../models/instructorModel'
import { StatusCodes } from 'http-status-codes'

jest.mock('../../models/availabilityModel', () => ({
	create: jest.fn(),
	findOne: jest.fn(),
}))

jest.mock('../../models/instructorModel', () => ({
	findById: jest.fn(),
}))

describe('Availability Controller', () =>{
	it('should create availability successfully', async () => {
		const req = {
			user: {
				role: 'admin',
				id: 'adminUserId'
			},
			body: {
				instructorId: 'instructorId',
				date: '2023-09-25',
				hours: ['09:00', '10:00']
			}
		} as unknown as Request

		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn()
		} as unknown as Response

		const mockedInstructor = {
			_id: 'instructorId',
			name: 'InstructorName'
		}

		const mockedAvailability = {
			_id: 'availabilityId',
			...req.body
		};

		(Instructor.findById as jest.Mock).mockResolvedValue(mockedInstructor);
		(Availability.findOne as jest.Mock).mockResolvedValue(null);
		(Availability.create as jest.Mock).mockResolvedValue(mockedAvailability)

		await availabilityController.create(req,res)

		expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED)
		expect(res.json).toHaveBeenCalledWith({ availability: mockedAvailability })
		expect(Instructor.findById).toHaveBeenCalledWith('instructorId')
		expect(Availability.findOne).toHaveBeenCalledWith({
			instructorId: 'instructorId',
			date: '2023-09-25',
		})
		expect(Availability.create).toHaveBeenCalledWith(req.body)

	})
})