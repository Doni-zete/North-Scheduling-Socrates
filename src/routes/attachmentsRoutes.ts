import express from 'express'
import uploadController from '../controllers/uploadsController'
import authenticateUser from '../middlewares/authentication'
import { authorizePermissions } from '../middlewares/authorization'

const Router = express.Router()

Router.post('/attachments/upload', authenticateUser, authorizePermissions(['student']), uploadController.uploadFile)


export default Router