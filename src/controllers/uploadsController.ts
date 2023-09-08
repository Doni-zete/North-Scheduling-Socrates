import { Request, Response } from 'express'
import customApiErrors from '../errors/customApiErrors'
import path from 'path'
import { StatusCodes } from 'http-status-codes'

const uploadFile = async (req: Request, res: Response) => {

	const files = req.files

	if(!files){
		throw new customApiErrors.BadRequestError('Nenhum arquivo foi enviado')
	}

	const allowedExtension = ['.pdf', '.txt', '.ocx']

	const UploadedFiles = []

	for (const fileKey in files) {
		if (Object.hasOwnProperty.call(files, fileKey)) {
			const file = files[fileKey]
			const fileExtension = path.extname(file.name).toLowerCase()

			if (!allowedExtension.includes(fileExtension)){
				throw new customApiErrors.BadRequestError('Apenas arquivos PDF, TXT e Word são permitidos')
			}

			const uniqueFileName = `${Date.now()}_${file.name}`
			const uploadPath = path.join(__dirname, '../tmp', uniqueFileName)

			await file.mv(uploadPath)
			
			UploadedFiles.push(uploadPath)
		}
	}
	res.status(StatusCodes.OK).json('Upload concluido.')
}

export default uploadFile