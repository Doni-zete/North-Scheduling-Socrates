import { StatusCodes } from 'http-status-codes'
import { Request, Response } from 'express'
import customApiErrors from '../errors/customApiErrors'
import {v2 as cloudinary} from 'cloudinary'
import path from 'path'

const uploadFile = async (req: Request, res: Response) => {

	if (!req.files || Object.keys(req.files).length === 0) {
		throw new customApiErrors.BadRequestError('Nenhum arquivo foi enviado.')
	}

	const file = req.files.arquivo

	const allowedExtensions = ['.pdf', '.txt', '.docx']
	const fileExtension = path.extname(file.name).toLocaleLowerCase()

	if (!allowedExtensions.includes(fileExtension)) {
		throw new customApiErrors.BadRequestError('Apenas arquivos PDF, TXT e Word são permitidos.')
	}

	const result = await cloudinary.uploader.upload(file.tempFilePath, {
		resource_type: 'auto'
	})

	if(!result || !result.secure_url){
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'Falha no upload do arquivo'})
	}

	const publicUrl = result.secure_url

	return res.status(StatusCodes.OK).json({ msg: `Arquivo enviado com sucesso! URL: ${publicUrl}` })
}

export default uploadFile