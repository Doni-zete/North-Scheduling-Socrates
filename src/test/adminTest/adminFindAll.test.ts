import { Request, Response } from 'express'
import adminController from '../../controllers/adminController'
import Admin from '../../models/adminModel'
import { StatusCodes } from 'http-status-codes'
import dotenv from 'dotenv'
dotenv.config()

//Importando funções do controller
jest.mock('../../models/adminModel', () => ({
	find: jest.fn()
}))

//Teste de listagem dos ADMINs
describe('Should list all admins', () => {
	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should successfully get a list of all registered admins', async () => {
		//request
		const req = {} as Request

		//response
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as unknown as Response

		//informações dos Admins
		const mockedAdmins = [
			{
				_id: 'mockedId1',
				name: 'Jakob',
				role: 'admin',
			},
			{
				_id: 'mockedId2',
				name: 'Michael',
				role: 'admin',
			}
		];

		(Admin.find as jest.Mock).mockReturnValue({
			select: jest.fn().mockResolvedValue(mockedAdmins)
		})

		//Esperar que o adminController faça o processamento da requisição
		await adminController.findAll(req, res)

		//Espera-se que o código retorne 200
		expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
		//Espera-se que o json retorne o mockedAdmin
		expect(res.json).toBeCalledWith({
			admins: mockedAdmins
		})

		//Espera-se que o código seja capaz de efetuar o método listagem
		expect(Admin.find).toHaveBeenCalledWith({})

		expect((Admin.find as jest.Mock).mock.results[0].value.select).toHaveBeenCalledWith('-password')
	})


})