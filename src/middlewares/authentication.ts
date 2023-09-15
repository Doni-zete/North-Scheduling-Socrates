import jwt from 'jsonwebtoken'
import customApiErrors from '../errors/customApiErrors'
import { Request, Response, NextFunction } from 'express'

const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
	const token = req.signedCookies.token
	if (!token) {
		throw new customApiErrors.UnauthenticatedError('You need to be logged in to access this route!')
	}

	const payload = jwt.verify(token, process.env.JWT_SECRET) as { id: string, name: string, role: string }
	req.user = { id: payload.id, name: payload.name, role: payload.role }

	next()
}

export default authenticateUser