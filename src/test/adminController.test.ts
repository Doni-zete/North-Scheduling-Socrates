import { Request, Response } from 'express'
import adminController from '../controllers/adminController'
import Admin from '../models/adminModel'
import { StatusCodes } from 'http-status-codes'
import dotenv from 'dotenv'
dotenv.config()

jest.mock('../models/adminModel', () => ({
	create: jest.fn(),
	findOne: jest.fn(),
	comparePassword: jest.fn(),
	find: jest.fn(),
	findById: jest.fn(),
	findByIdAndUpdate: jest.fn(),
	findByIdAndRemove: jest.fn(),
}))

//Teste de cadastro do admin
describe('Admin Registration', () => {
	it('should successfully register an admin', async () => {
		const req = {
			body: {
				key: process.env.CREATE_ADMIN_KEY,
			},
		} as Request

		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as unknown as Response

		const mockedAdmin = {
			_id: 'mockId',
			name: 'Jakob',
			role: 'admin',
		};
		(Admin.create as jest.Mock).mockResolvedValue(mockedAdmin)

		await adminController.register(req, res)

		expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED)
		expect(res.json).toHaveBeenCalledWith({
			admin: mockedAdmin,
		})
		expect(Admin.create).toHaveBeenCalledWith(req.body)
	})
})

//Teste de login do admin
describe('Admin Login', () => {
	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should successfully login an admin', async () => {
		const req = {
			body: {
				email: 'jakob@email.com',
				password: 'password456',
			},
		} as Request

		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
			cookie: jest.fn(),
		} as unknown as Response

		const mockedAdmin = {
			_id: 'mockedId',
			name: 'Jakob',
			role: 'admin',
			comparePassword: jest.fn().mockResolvedValue(true),
		}

			; (Admin.findOne as jest.Mock).mockResolvedValue(mockedAdmin)

		await adminController.login(req, res)

		expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
		expect(res.json).toBeCalledWith({
			admin: {
				_id: mockedAdmin._id,
				name: mockedAdmin.name,
				role: mockedAdmin.role,
			},
			msg: 'Logged in successfully',
		})

		expect(Admin.findOne).toHaveBeenCalledWith({ email: req.body.email })
	})


})

//Teste de findAll do admin
describe('Should list all admins', () => {
	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should successfully get a list of all registered admins', async () => {
		const req = {} as Request

		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as unknown as Response

		const mockedAdmins = [
			{
				_id: 'mockedId',
				name: 'Jakob',
				role: 'admin',
			},
			{
				_id: 'mockedId',
				name: 'Michael',
				role: 'admin',
			}
		];

		(Admin.find as jest.Mock).mockReturnValue({
			select: jest.fn().mockResolvedValue(mockedAdmins)
		})

		await adminController.findAll(req, res)

		expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
		expect(res.json).toBeCalledWith({
			admins: mockedAdmins
		})

		expect(Admin.find).toHaveBeenCalledWith({})

		expect((Admin.find as jest.Mock).mock.results[0].value.select).toHaveBeenCalledWith('-password')
	})


})

//Teste de findById do admin
describe('Should list an admin by their id', () => {
	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should successfully get an admin by their id', async () => {
		const req = {
			user: {role: 'admin', id: 'adminId'},
			params: {id: 'adminId'}
		} as unknown as Request

		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as unknown as Response

		const mockedAdmin =
			{
				_id: 'mockedId',
				name: 'Jakob',
				role: 'admin',
			};

		(Admin.findById as jest.Mock).mockReturnValue({
			select: jest.fn().mockResolvedValue(mockedAdmin)
		})

		await adminController.findById(req, res)

		expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
		expect(res.json).toBeCalledWith({
			admin: mockedAdmin
		})

		expect(Admin.findById).toHaveBeenCalledWith('adminId')

		expect((Admin.findById as jest.Mock).mock.results[0].value.select).toHaveBeenCalledWith('-password')
	})


})

//Teste de findByIdAndUpdate do admin
describe('Should update an admin', () => {
	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should successfully get an admin by their id and update them', async () => {
		const req = {
			user: {role: 'admin', id: 'adminId'},
			params: {id: 'adminId'},
			body: {
				email: 'jakob@email.com',
				password: 'password456'
			}
		} as unknown as Request

		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as unknown as Response

		const mockedUpdatedAdmin =
			{
				name: 'Jakob',
				password: 'password123'
			};

		(Admin.findByIdAndUpdate as jest.Mock).mockReturnValue({
			select: jest.fn().mockResolvedValue(mockedUpdatedAdmin)
		})

		await adminController.updateId(req, res)

		expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
		expect(res.json).toBeCalledWith({
			updatedAdmin: mockedUpdatedAdmin
		})

		expect(Admin.findByIdAndUpdate).toHaveBeenCalledWith(req.params.id, req.body, {new: true})

		// expect(Admin.findById).toHaveBeenCalledWith(req.params.id)

		// expect((Admin.findById as jest.Mock).mock.results[0].value.select).toHaveBeenCalledWith('-password')
	})


})