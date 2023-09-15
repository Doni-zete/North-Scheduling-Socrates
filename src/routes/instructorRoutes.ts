import express from 'express'
import instructorController from '../controllers/instructorController'
import { logout } from '../controllers/adminController'
import authenticateUser from '../middlewares/authentication'
import { authorizePermissions } from '../middlewares/authorization'

const Router = express.Router()

// Auth-routes
Router.post('/auth/instructor/register', instructorController.register)
Router.post('/auth/instructor/login', instructorController.login)
Router.get('/auth/instructor/logout', logout)

Router.get('/instructor', authenticateUser, authorizePermissions(['admin']), instructorController.findAll)
Router.get('/instructor/:id', authenticateUser, authorizePermissions(['instructor', 'admin']), instructorController.findById)
Router.patch('/instructor/:id', authenticateUser, authorizePermissions(['instructor', 'admin']), instructorController.updateId)
Router.delete('/instructor/:id', authenticateUser, authorizePermissions(['instructor', 'admin']), instructorController.deleteId)

export default Router