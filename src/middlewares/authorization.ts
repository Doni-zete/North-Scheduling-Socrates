import { Request, Response, NextFunction } from 'express'
import customApiErrors from '../errors/customApiErrors'

export const authorizePermissions = (requiredRoles: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {

		const userRole = req.user.role

		if (!requiredRoles.includes(userRole)) {
			throw new customApiErrors.UnauthenticatedError('Unauthorized to access this route')
		}

		next()
	}
}