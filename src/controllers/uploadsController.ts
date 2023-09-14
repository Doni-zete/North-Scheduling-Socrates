import { Request, Response } from 'express'
import customApiErrors from '../errors/customApiErrors'
import path from 'path'
import { StatusCodes } from 'http-status-codes'
import Appointment from '../models/appointmentModel'
import crypto from 'crypto'
import fs from 'fs'

const uploadFilebyAppointmentId = async (req: Request, res: Response) => {

	const files = req.files

	if (!files) {
		throw new customApiErrors.BadRequestError('Nenhum arquivo foi enviado')
	}

	const tmpPath = path.join(__dirname, '../tmp')

	if (!fs.existsSync(tmpPath)) {
		fs.mkdirSync(tmpPath)
	}

	const allowedExtension = ['.pdf', '.txt', '.ocx']

	const UploadedFiles = []

	for (const fileKey in files) {
		if (Object.hasOwnProperty.call(files, fileKey)) {
			const file = files[fileKey]
			let fileExtension = path.extname(file.name).toLowerCase()
			if (!allowedExtension.includes(fileExtension)) {
				throw new customApiErrors.BadRequestError('Apenas arquivos PDF, TXT e Word são permitidos')
			}

			const appointmentId = req.params.id
			const appointment = await Appointment.findById(appointmentId)

			if (!appointment) {
				throw new customApiErrors.NotFoundError('No Appointment with this id')
			}

			if (req.user.role === 'student' && req.params.studentId !== req.user.id) {
				throw new customApiErrors.UnauthorizedError('You can not update a appointment of others students!')
			} else if (req.user.role === 'instructor' && appointment.instructorId.toString() !== req.user.id) {
				// throw new error
			}

			if (fileExtension === '.ocx') {
				fileExtension = '.docx'
			}

			const uniqueFileName = crypto.randomUUID() + fileExtension
			const uploadPath = path.join(__dirname, '../tmp/', uniqueFileName)
			await file.mv(uploadPath)
			UploadedFiles.push(uploadPath)

			appointment.attachments.push(`/tmp/${uniqueFileName}`)
			await appointment.save()

			res.status(StatusCodes.OK).json({ file: { src: `/tmp/${uniqueFileName}` } })
		}
	}
}

const uploadController = { uploadFilebyAppointmentId }

export default uploadController