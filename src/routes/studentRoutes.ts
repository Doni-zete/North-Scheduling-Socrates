import { Router } from "express";
import * as studentController from '../controllers/studentController'
const router = Router()


router.post('/student/create', studentController.createStudent)
router.get('/student/findAll', studentController.findAllStudents)




export default router