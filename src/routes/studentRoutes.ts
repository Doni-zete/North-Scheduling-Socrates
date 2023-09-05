import express from 'express'
import studentController from '../controllers/studentController'
import authenticateUser from '../middlewares/authentication'
import { authorizePermissions } from '../middlewares/authorization'
import uploadFile from '../controllers/uploadsController'

const Router = express.Router()

// Auth-routes
Router.post('/auth/student/register', studentController.register)
Router.post('/auth/student/login', studentController.login)
Router.get('/auth/student/logout', studentController.logout)

Router.get('/student/', authenticateUser, authorizePermissions(['admin']), studentController.findAll)
Router.get('/student/:id', authenticateUser, authorizePermissions(['student', 'admin']), studentController.findById)
Router.get('/student/:id/appointments', authenticateUser, authorizePermissions(['student', 'admin']), studentController.findAppointmentsByStudentId)
Router.patch('/student/:id', authenticateUser, authorizePermissions(['student', 'admin']), studentController.updateId)
Router.delete('/student/:id', authenticateUser, authorizePermissions(['student', 'admin']), studentController.deleteId)
Router.post('/student/upload', authenticateUser, authorizePermissions(['student']), uploadFile)


export default Router