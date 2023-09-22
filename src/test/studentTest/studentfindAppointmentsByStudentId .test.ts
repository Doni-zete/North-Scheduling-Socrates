import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import studentController from '../../controllers/studentController'
import Appointment from '../../models/appointmentModel'

jest.mock('../../models/appointmentModel', () => ({
	find: jest.fn()
}))

describe('Should findAppointmentsByStudentId', () => {

	it('Should find appointment student by ID', async () => {
		const req = {
			user: { role: 'admin', id: '6500e1b902055bfcc7527f00' },
			params: { id: '6500e1b902055bfcc7527f00' },
	
		} as unknown as Request

		const jsonMock = jest.fn()
		const statusMock = jest.fn().mockReturnValue({ json: jsonMock })

		const res = {
			status: statusMock,
		} as unknown as Response

		const mockAppoitments = {
			name: 'Blue',
			instructorId: '65044bf360353efe5a88c2ab',
			student: '6500e1b902055bfcc7527f00',
			date: '2023-09-05',
			hour: '10:00',
			attachments: '/tmp/2ab31c01-150a-4d3b-a1a6-62d71102cac6.txt',
		};

		(Appointment.find as jest.Mock).mockReturnValue({
			select: jest.fn().mockResolvedValue(mockAppoitments)
		})
		await studentController.findAppointmentsByStudentId(req, res)

		expect(statusMock).toHaveBeenCalledWith(StatusCodes.OK)
		expect(jsonMock).toHaveBeenCalledWith({appointment: mockAppoitments})

	})
})