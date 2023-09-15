import express from 'express'
import uploadController from '../controllers/uploadsController'
import authenticateUser from '../middlewares/authentication'
import { authorizePermissions } from '../middlewares/authorization'

const Router = express.Router()

Router.post('/appointment/:id/attachment', authenticateUser, authorizePermissions(['student']), uploadController.uploadFilebyAppointmentId)


export default Router