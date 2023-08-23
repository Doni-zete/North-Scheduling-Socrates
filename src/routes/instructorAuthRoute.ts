import express from 'express'
const instructorRouter = express.Router()
import {register, login, logout} from '../controllers/instructorAuth'

instructorRouter.post('/instructor/register', register)
instructorRouter.post('/instructor/login', login)
instructorRouter.get('/instructor/logout', logout)

export default instructorRouter