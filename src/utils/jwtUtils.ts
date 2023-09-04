import jwt from 'jsonwebtoken'
import { Response } from 'express'

export type jwtRoles = 'instructor' | 'student' | 'admin'

export interface jwtEntitie {
	_id: string
	name: string
}

export function createJwt(entitie: jwtEntitie, role: jwtRoles) {
	return jwt.sign({ id: entitie._id, name: entitie.name, role: role }, process.env.JWT_SECRET, { expiresIn: Number(process.env.JWT_LIFETIME) })
}

export function setResponseCookie(token: string, res: Response) {
	res.cookie('token', token, { httpOnly: true, expires: new Date(Date.now() + Number(process.env.JWT_LIFETIME) * 1000), signed: true })
}