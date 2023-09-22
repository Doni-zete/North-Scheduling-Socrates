import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import uploadController from '../../controllers/uploadsController'
import Appointment from '../../models/appointmentModel'

describe('Upload file by appointment ID', () => {
	it('Should upload a file successfully', async () => {
		const req = {
			params: { appointmentId: '6504504a60353efe5a88c2b6' },
			files: {
				foo: {
					name: 'test.txt',
					mv: jest.fn(),
				},
			},
			user: {
				id: '65044adc60353efe5a88c2a3',
			},
		} as unknown as Request

		const jsonMock = jest.fn()
		const statusMock = jest.fn().mockReturnValue({ json: jsonMock })

		const res: Response = {
			status: statusMock,
		} as unknown as Response

		const mockAppointment = {
			id: '6504504a60353efe5a88c2b6',
			instructorId: '65044bf360353efe5a88c2ab',
			studentId: '65044adc60353efe5a88c2a3',
			attachments: ['test.txt'],
			save: jest.fn(),
		}

		Appointment.findById = jest.fn().mockResolvedValue(mockAppointment)
		Appointment.create = jest.fn().mockResolvedValue(mockAppointment)

		await uploadController.uploadFilebyAppointmentId(req, res)

		expect(statusMock).toHaveBeenCalledWith(StatusCodes.CREATED)

		expect(jsonMock).toHaveBeenCalledWith({ urlPath: expect.any(String) })
	})
})
