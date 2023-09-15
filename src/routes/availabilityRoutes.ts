import express from 'express'
import authenticateUser from '../middlewares/authentication'
import { authorizePermissions } from '../middlewares/authorization'
import availabilityController from '../controllers/availabilityController'

const Router = express.Router()

Router.post('/availability', authenticateUser, authorizePermissions(['instructor', 'admin']), availabilityController.create)
Router.get('/availability', authenticateUser, authorizePermissions(['admin']), availabilityController.findAll)
Router.get('/availability/:id', authenticateUser, authorizePermissions(['admin']), availabilityController.findById)

Router.get('/instructor/:id/availability', authenticateUser, authorizePermissions(['instructor', 'student', 'admin']), availabilityController.findAvailabilitysByInstructorId)
Router.patch('/instructor/:instructorId/availability/:id', authenticateUser, authorizePermissions(['instructor', 'admin']), availabilityController.updateAvailabilityByInstructorId)
Router.delete('/instructor/:instructorId/availability/:id', authenticateUser, authorizePermissions(['instructor', 'admin']), availabilityController.deleteAvailabilityByInstructorId)


export default Router