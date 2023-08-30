import Admin from '../models/adminModel'
import { StatusCodes } from 'http-status-codes'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import customApiErrors from '../errors/customApiErrors'
import mongoose from 'mongoose'


const register = async (req: Request, res: Response) => {
    const { name, email, password, key } = req.body

    if (key !== process.env.CREATE_ADMIN_KEY) {
        throw new customApiErrors.UnauthorizedError('Invalid admin key')
    }

    const admin = await Admin.create({ name, email, password })

    return res.status(StatusCodes.CREATED).json({ admin: { _id: admin._id, name: admin.name, role: 'admin' } })
}

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new customApiErrors.BadRequestError('Please provide email and password')
    }

    const admin = await Admin.findOne({ email })
    if (!admin) {
        throw new customApiErrors.UnauthenticatedError("Invalid Credentials")
    }

    const isPasswordCorrect = await admin.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new customApiErrors.UnauthenticatedError('Invalid Credentials')
    }

    const token = jwt.sign({ id: admin._id, name: admin.name, role: 'admin' }, process.env.JWT_SECRET)
    res.cookie('token', token, { httpOnly: true, expires: new Date(Date.now() + 30 * 60 * 1000), signed: true })

    return res.status(StatusCodes.OK).json({ admin: { name: admin.name }, msg: 'Logged in successfully' })
}

const logout = async (req: Request, res: Response) => {
    res.clearCookie('token')

    return res.status(StatusCodes.OK).json({ msg: 'User logged out!' })
}

const findAll = async (req: Request, res: Response) => {
    const admins = await Admin.find({})

    return res.status(StatusCodes.OK).json({ admins })
}

const findById = async (req: Request, res: Response) => {
    const admin = await Admin.findById(req.params.id)

    return res.status(StatusCodes.OK).json({ admin })
}

const updateId = async (req: Request, res: Response) => {
    const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true })

    return res.status(StatusCodes.OK).json({ updatedAdmin })
}

const deleteId = async (req: Request, res: Response) => {
    const admin = await Admin.findByIdAndRemove(req.params.id)

    return res.status(StatusCodes.OK).json({ msg: "Admin deleted successfully" })
}

const adminController = { register, login, logout, findAll, findById, updateId, deleteId }

export default adminController