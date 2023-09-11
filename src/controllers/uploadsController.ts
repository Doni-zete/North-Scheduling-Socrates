import { Request, Response } from 'express'
import customApiErrors from '../errors/customApiErrors'
import path from 'path'
import { StatusCodes } from 'http-status-codes'
import crypto from 'crypto'

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
			let fileExtension = path.extname(file.name).toLowerCase()

			if (!allowedExtension.includes(fileExtension)){
				throw new customApiErrors.BadRequestError('Apenas arquivos PDF, TXT e Word são permitidos')
			}

			if(fileExtension === '.ocx'){
				fileExtension = '.docx'
			}

			const uniqueFileName = crypto.randomUUID() + fileExtension


			const uploadPath = path.join(__dirname, '../tmp/', uniqueFileName)

			await file.mv(uploadPath)
			console.log(uploadPath)
			
			UploadedFiles.push(uploadPath)

			res.status(StatusCodes.OK).json({ file: { src: `/tmp/${uniqueFileName}` }})
		}
	}
}

const uploadController = {uploadFile}

export default uploadController