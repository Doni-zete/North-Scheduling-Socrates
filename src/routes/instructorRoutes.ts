import express from 'express'
import { register, login, logout, findAllInstructors, updateInstructor, deleteInstructor } from '../controllers/instructorController'
import authenticateUser from '../middlewares/authentication'
import { authorizePermissions } from '../middlewares/authorization'

const instructorRouter = express.Router()

instructorRouter.post('/instructor/register', register)
instructorRouter.post('/instructor/login', login)
instructorRouter.get('/instructor/logout', logout)
instructorRouter.get('/instructor/findAll', authenticateUser, authorizePermissions(['instructor']), findAllInstructors)
instructorRouter.patch('/instructor/update/:id', authenticateUser, authorizePermissions(['instructor']), updateInstructor)
instructorRouter.delete('/instructor/delete/:id', authenticateUser, authorizePermissions(['instructor']), deleteInstructor)

export default instructorRouter