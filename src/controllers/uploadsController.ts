import { Request, Response } from 'express'
import customApiErrors from '../errors/customApiErrors'
import path from 'path'
import Appointment from '../models/appointmentModel'
import { StatusCodes } from 'http-status-codes'
import crypto from 'crypto'
import fs from 'fs'


const uploadFilebyAppointmentId = async (req: Request, res: Response) => {
	if (!req.files || Object.keys(req.files).length === 0) {
		throw new customApiErrors.BadRequestError('No files were uploaded')
	}

	if (req.files.foo instanceof Array) {
		throw new customApiErrors.BadRequestError('You can not upload more than one file per time')
	}

	const allowedExtension = ['.pdf', '.txt', '.docx']
	
	let fileExtension = path.extname(req.files.foo.name)
	if (fileExtension === '.ocx') {
		fileExtension = '.docx'
	}
	
	if (!allowedExtension.includes(fileExtension)) {
		throw new customApiErrors.BadRequestError('Only files extensions .pdf, .txt and .docx are allowed.')
	}
	
	const appointment = await Appointment.findById(req.params.id)
	if (!appointment) {
		throw new customApiErrors.NotFoundError('Appointment not found')
	}
	
	if (appointment.studentId.toString() !== req.user.id) {
		throw new customApiErrors.UnauthorizedError('You can not attach in appointment of others!')
	}
	
	const tmpPath = path.join(__dirname, '../tmp')
	if (!fs.existsSync(tmpPath)) {
		fs.mkdirSync(tmpPath)
	}

	const uniqueFileName = crypto.randomUUID() + fileExtension

	const uploadPath = path.join(__dirname, '../tmp/', uniqueFileName)
	req.files.foo.mv(uploadPath)

	const urlPath = `/tmp/${uniqueFileName}`
	appointment.attachments.push(urlPath)
	appointment.save()
	
	res.status(StatusCodes.CREATED).json({ urlPath })
}

const uploadController = { uploadFilebyAppointmentId }

export default uploadController