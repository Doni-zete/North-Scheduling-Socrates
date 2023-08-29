import { Router } from "express";
import * as studentController from '../controllers/studentController'
import authenticateUser from "../middlewares/authentication";
import { authorizePermissions } from "../middlewares/authorization";

const router = Router()


router.post('/student/register', studentController.register)
router.post('/student/login', studentController.login)
router.get('/student/logout', studentController.logout)
router.get('/student/findAll', authenticateUser, authorizePermissions(['student']), studentController.findAllStudents)
router.patch('/student/update/:id', authenticateUser, authorizePermissions(['student']), studentController.updateStudent)
router.delete('/student/delete/:id', authenticateUser, authorizePermissions(['student']), studentController.deleteStudent)


export default router