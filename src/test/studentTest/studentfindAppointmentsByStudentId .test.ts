import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import studentController from '../../controllers/studentController'
import Student from '../../models/studentModel'
import customApiErrors from '../../errors/customApiErrors'

jest.mock('../../models/studentModel', () => ({
	findAppointmentsByStudentId: jest.fn(),
	find: jest.fn()

}))

describe('Should findAppointmentsByStudentId', () => {

	it('Should find appointment student by ID', async () => {
		const req: Request = {
			params: { id: '65044adc60353efe5a88c2a3' },
		} as unknown as Request

		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as unknown as Response

		const mockAppoitments = {
			name: 'Blue',
			instructorId: '65044bf360353efe5a88c2ab',
			student: '65044adc60353efe5a88c2a3',
			date: '2023-09-05',
			hour: '10:00',
			attachments: '/tmp/2ab31c01-150a-4d3b-a1a6-62d71102cac6.txt',
		}


		try {
			const updatedStudent = await studentController.findAppointmentsByStudentId(req, res)

			if (!updatedStudent) {
				throw new customApiErrors.NotFoundError(
					`No item found with _id: ${req.params.id}`
				)
			}

			Student.find = jest.fn().mockResolvedValue(mockAppoitments)

			expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
			expect(res.json).toHaveBeenCalledWith({
				appointment: mockAppoitments
			})
			console.log(updatedStudent)

		} catch (error) {
			//console.log(error)
		}
	})

})