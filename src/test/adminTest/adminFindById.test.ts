import { Request, Response } from 'express'
import adminController from '../../controllers/adminController'
import Admin from '../../models/adminModel'
import { StatusCodes } from 'http-status-codes'
import dotenv from 'dotenv'
dotenv.config()

//Importando funções do controller
jest.mock('../../models/adminModel', () => ({
	findById: jest.fn()
}))

describe('Should find aa admin by their Id', () => {
	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should successfully find an admin by their Id', async () => {
		//request
		const req: Request = {
			user: { role: 'admin', id: 'adminId' },
			params: { id: 'adminId' }
		} as unknown as Request

		//response
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as unknown as Response

		//informação do Admin
		const mockedAdmin = {
			_id: 'mockedId',
			name: 'Jakob',
			role: 'admin'
		};

		(Admin.findById as jest.Mock).mockReturnValue({
			select: jest.fn().mockResolvedValue(mockedAdmin)
		})

		//Esperar que o adminController faça o processamento da requisição
		await adminController.findById(req, res)

		//Espera-se que o código retorne 200
		expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
		//Espera-se que o json retorne o mockedAdmin
		expect(res.json).toHaveBeenCalledWith({
			admin: mockedAdmin
		})

		//Espera-se que o código seja capaz de efetuar o método findById
		expect(Admin.findById).toHaveBeenCalledWith('adminId')

		expect((Admin.findById as jest.Mock).mock.results[0].value.select).toHaveBeenCalledWith('-password')
	})
})