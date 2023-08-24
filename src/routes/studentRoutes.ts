import { Router } from "express";
import * as studentController from '../controllers/studentController'
const router = Router()


router.post('/student/create', studentController.createStudent)
router.get('/student/findAll', studentController.findAllStudents)
router.put('/student/update/:id', studentController.updateStudent)
router.delete('/student/delete/:id', studentController.deleteStudent)


export default router