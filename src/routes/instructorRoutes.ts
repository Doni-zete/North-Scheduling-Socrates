import express from 'express'
const instructorRouter = express.Router()
import {register, login} from '../controllers/instructorController'

instructorRouter.post('/instructor/register', register)
instructorRouter.post('/instructor/login', login)

export default instructorRouter