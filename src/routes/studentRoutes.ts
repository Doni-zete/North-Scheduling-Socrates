import { Router } from "express";
import * as studentController from '../controllers/studentController'
import authenticateUser from "../middlewares/authnetication";

const router = Router()


router.post('/student/create', studentController.registerStudent)
router.get('/student/findAll', studentController.findAllStudents)
router.put('/student/update/:id', studentController.updateStudent)
router.delete('/student/delete/:id', studentController.deleteStudent)


export default router