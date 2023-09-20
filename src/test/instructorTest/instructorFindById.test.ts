import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import instructorController from '../../controllers/instructorController'
import Instructor from '../../models/instructorModel'


describe('Instructors findById', () => {

    afterEach(() => {
        jest.clearAllMocks();
    })
    it('should return an instructor by id', async () => {
        const mockReq = {
            params: {
                id: '6508854a72a40e21e3c62efd',
            },
            user: {
                role: 'instructor',
                id: '6508854a72a40e21e3c62efd',
                name: 'Azul'
            },
        } as any as Request

        const jsonMock = jest.fn()
        const statusMock = jest.fn().mockReturnValue({ json: jsonMock })

        const mockRes: Response = {
            status: statusMock,
        } as any as Response

        const mockInstructor = {
            _id: '65044bf860353efe5788c2ab',
            name: 'Azul',
            email: 'azul@email.com',
            password: '1234',
            comparePassword: jest.fn().mockResolvedValue(true),

        }

        const selectMock = jest.fn().mockReturnValue(mockInstructor)
        Instructor.findById = jest.fn().mockReturnValue({ select: selectMock })

        await instructorController.findById(mockReq, mockRes)

        expect(statusMock).toHaveBeenCalledWith(StatusCodes.OK)
        expect(jsonMock).toHaveBeenCalledWith({ instructor: mockInstructor })
    })

})




