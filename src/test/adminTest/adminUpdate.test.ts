import { Request, Response } from 'express'
import adminController from '../../controllers/adminController'
import Admin from '../../models/adminModel'
import { StatusCodes } from 'http-status-codes'
import dotenv from 'dotenv'
dotenv.config()

//Importando funções do controller
jest.mock('../../models/adminModel', () => ({
	findByIdAndUpdate: jest.fn()
}))

//Teste de atualização do ADMIN
describe('Should update an admin', () => {
	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should successfully get an admin by their id and update them', async () => {
		//request
		const req = {
			user: {role: 'admin', id: 'adminId'},
			params: {id: 'adminId'},
			body: {
				email: 'jakob@email.com',
				password: 'password456'
			}
		} as unknown as Request

		//response
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as unknown as Response

		//Informação do Admin
		const mockedUpdatedAdmin =
			{
				name: 'Jakob',
				oldPassword: 'password456',
				password: 'password123'
			};

		(Admin.findByIdAndUpdate as jest.Mock).mockReturnValue({
			select: jest.fn().mockResolvedValue(mockedUpdatedAdmin)
		})

		//Esperar que o adminController faça o processamento da requisição
		await adminController.updateId(req, res)

		//Espera-se que o código retorne 200
		expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
		//Espera-se que o json retorne o mockedAdmin
		expect(res.json).toBeCalledWith({
			updatedAdmin: mockedUpdatedAdmin
		})

	})


})