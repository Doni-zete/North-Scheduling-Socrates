import { Router } from "express";
import * as studentController from '../controllers/studentController'
import authenticateUser from "../middlewares/authentication";

const router = Router()


router.post('/student/register', studentController.register)
router.post('student/login', studentController.login)
router.get('student/login', studentController.logout)

router.use(authenticateUser)

router.get('/student/findAll', studentController.findAllStudents)
router.put('/student/update/:id', studentController.updateStudent)
router.delete('/student/delete/:id', studentController.deleteStudent)


export default router