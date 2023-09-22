import { Request, Response } from 'express'
import adminController from '../../controllers/adminController'
import Admin from '../../models/adminModel'
import { StatusCodes } from 'http-status-codes'
import dotenv from 'dotenv'
dotenv.config()

//Importando funções do controller
jest.mock('../../models/adminModel', () => ({
	create: jest.fn(),
	findOne: jest.fn(),
	comparePassword: jest.fn(),
}))

//Teste de cadastro do ADMIN
describe('Admin Registration', () => {
	it('Should successfully create an admin', async () => {
		//request
		const req = {
			body: {
				key: process.env.CREATE_ADMIN_KEY,
			},
		} as Request

		//response
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as unknown as Response

		//Informação do Admin
		const mockedAdmin = {
			_id: 'mockedId',
			name: 'Jakob',
			role: 'admin'
		};
		
		(Admin.create as jest.Mock).mockResolvedValue(mockedAdmin)

		//Esperar que o adminController faça o processamento da requisição
		await adminController.register(req, res)

		//Espera-se que o código retorne 201
		expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED)
		//Espera-se que o json retorne o mockedAdmin
		expect(res.json).toHaveBeenCalledWith({
			admin: mockedAdmin,
		})
		//Espera-se que o código seja capaz de efetuar o método create
		expect(Admin.create).toHaveBeenCalledWith(req.body)
	})
})

//Teste de login do admin
describe('Admin Login', () => {
	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should successfully login an admin', async () => {
		//request
		const req = {
			body: {
				email: 'jakob@email.com',
				password: 'password456',
			},
		} as Request

		//response
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
			cookie: jest.fn(),
		} as unknown as Response

		//informação do Admin
		const mockedAdmin = {
			_id: 'mockedId',
			name: 'Jakob',
			role: 'admin',
			comparePassword: jest.fn().mockResolvedValue(true),
		};
		
		(Admin.findOne as jest.Mock).mockResolvedValue(mockedAdmin)

		//Esperar que o adminController faça o processamento da requisição
		await adminController.login(req, res)

		//Espera-se que o código retorne 200
		expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
		//Espera-se que o json retorne o mockedAdmin
		expect(res.json).toBeCalledWith({
			admin: {
				_id: mockedAdmin._id,
				name: mockedAdmin.name,
				role: mockedAdmin.role,
			},
			msg: 'Logged in successfully',
		})
		
		//Espera-se que o código seja capaz de efetuar o método login
		expect(Admin.findOne).toHaveBeenCalledWith({ email: req.body.email })
	})
})