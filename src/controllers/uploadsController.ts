import { StatusCodes } from 'http-status-codes'
import { Request, Response } from 'express'
import customApiErrors from '../errors/customApiErrors'
import cloudinary from 'cloudinary'
import fs from 'fs'
import path from 'path'

const uploadFile = async (req: Request,res: Response) =>{
    
    if(!req.files || Object.keys(req.files).length === 0){
        throw new customApiErrors.BadRequestError('Nenhum arquivo foi enviado.')
    }

    const file = req.files.arquivo

    const allowedExtensions = ['.pdf','.txt','.docx']
    const fileExtension = path.extname(file.name).toLocaleLowerCase()

    if (!allowedExtensions.includes(fileExtension)){
        throw new customApiErrors.BadRequestError('Apenas arquivos PDF, TXT e ord são permitidos.')
    }

}