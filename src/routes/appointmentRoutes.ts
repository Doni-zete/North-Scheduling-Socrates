import express from 'express'
import appointmentController from '../controllers/appointmentController'
import authenticateUser from '../middlewares/authentication'
import { authorizePermissions } from '../middlewares/authorization'


const Router = express.Router()

Router.post('/appointment', authenticateUser, authorizePermissions(['student', 'admin']), appointmentController.create)
Router.get('/appointment', authenticateUser, authorizePermissions(['admin']), appointmentController.findAll)
Router.get('/appointment/:id', authenticateUser, authorizePermissions(['admin']), appointmentController.findById)
Router.get('/instructor/:id/appointment', authenticateUser, authorizePermissions(['instructor', 'admin']), appointmentController.findAppointmentsByInstructorId)
Router.get('/student/:id/appointment', authenticateUser, authorizePermissions(['student', 'admin']), appointmentController.findAppointmentsByStudentId)
Router.patch('/appointment/:id', authenticateUser, authorizePermissions(['admin']), appointmentController.updateId)
Router.delete('/appointment/:id', authenticateUser, authorizePermissions(['admin']), appointmentController.deleteId)


export default Router