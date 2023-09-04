import express from 'express'
import adminController from '../controllers/adminController'
import authenticateUser from '../middlewares/authentication'
import { authorizePermissions } from '../middlewares/authorization'

const Router = express.Router()

// Auth-routes
Router.post('/auth/admin/register', adminController.register)
Router.post('/auth/admin/login', adminController.login)
Router.get('/auth/admin/logout', adminController.logout)

Router.get('/admin/', authenticateUser, authorizePermissions(['admin']), adminController.findAll)
Router.get('/admin/:id', authenticateUser, authorizePermissions(['admin']), adminController.findById)
Router.patch('/admin/:id', authenticateUser, authorizePermissions(['admin']), adminController.updateId)
Router.delete('/admin/:id', authenticateUser, authorizePermissions(['admin']), adminController.deleteId)


export default Router