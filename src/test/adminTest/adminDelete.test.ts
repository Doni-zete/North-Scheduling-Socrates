import { Request, Response } from 'express'
import adminController from '../../controllers/adminController'
import Admin from '../../models/adminModel'
import { StatusCodes } from 'http-status-codes'
import dotenv from 'dotenv'
dotenv.config()

//Importando funções do controller
jest.mock('../../models/adminModel', () => ({
	findByIdAndRemove: jest.fn(),
}))

//Teste de deletar um ADMIN
describe('Should delete an admin', () => {
	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should successfully get an admin by their id and delete them', async () => {
		//request
		const req = {
			user: {role: 'admin', id: 'adminId'},
			params: {id: 'adminId'},
		} as unknown as Request

		//response
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as unknown as Response

		(Admin.findByIdAndRemove as jest.Mock).mockResolvedValue({})

		//Esperar que o adminController faça o processamento da requisição
		await adminController.deleteId(req, res)

		//Espera-se que o código retorne 200
		expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
		//Espera-se que o json retorne o mockedAdmin
		expect(res.json).toBeCalledWith({
			msg: 'Admin deleted successfully'
		})
		//Espera-se que o código seja capaz de efetuar o método delete
		expect(Admin.findByIdAndRemove).toHaveBeenCalledWith(req.params.id)
	})


})