import express from 'express'
const instructorRouter = express.Router()
import {register, login} from '../controllers/instructorController'

instructorRouter.post('/register', register)
instructorRouter.post('/login', login)
