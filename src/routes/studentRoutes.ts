import { Router } from "express";
import * as studentController from '../controllers/studentController'
import authenticateUser from "../middlewares/authentication";
import { authorizePermissions } from "../middlewares/authorization";

const router = Router()


router.post('/student/register', studentController.register)
router.post('student/login', studentController.login)
router.get('student/login', studentController.logout)

router.use(authenticateUser)

router.get('/student/findAll', authorizePermissions(['student']), studentController.findAllStudents)
router.put('/student/update/:id', authorizePermissions(['student']), studentController.updateStudent)
router.delete('/student/delete/:id', authorizePermissions(['student']), studentController.deleteStudent)


export default router