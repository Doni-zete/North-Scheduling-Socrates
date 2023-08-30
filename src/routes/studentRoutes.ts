import express from 'express'
import studentController from '../controllers/studentController'
import authenticateUser from "../middlewares/authentication"
import { authorizePermissions } from "../middlewares/authorization"

const Router = express.Router()

// Auth-routes
Router.post('/auth/student/register', studentController.register)
Router.post('/auth/student/login', studentController.login)
Router.get('/auth/student/logout', studentController.logout)

Router.get('/student/', authenticateUser, authorizePermissions(['admin']), studentController.findAll)
Router.get('/student/:id', authenticateUser, authorizePermissions(['student']), studentController.findById)
Router.patch('/student/:id', authenticateUser, authorizePermissions(['student']), studentController.updateId)
Router.delete('/student/:id', authenticateUser, authorizePermissions(['student']), studentController.deleteId)


export default Router