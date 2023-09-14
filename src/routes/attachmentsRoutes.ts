import express from 'express'
import uploadController from '../controllers/uploadsController'
import authenticateUser from '../middlewares/authentication'
import { authorizePermissions } from '../middlewares/authorization'

const Router = express.Router()

Router.post('/attachments/:studentId/upload/:id', authenticateUser, authorizePermissions(['student']), uploadController.uploadFilebyAppointmentId)


export default Router