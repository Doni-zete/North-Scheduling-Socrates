import express from 'express'
const instructorAuthRouter = express.Router()
import {register, login, logout} from '../controllers/instructorAuth'

instructorAuthRouter.post('/instructor/register', register)
instructorAuthRouter.post('/instructor/login', login)
instructorAuthRouter.get('/instructor/logout', logout)

export default instructorAuthRouter