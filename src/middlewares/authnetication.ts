import jwt from "jsonwebtoken";
import customApiErrors from "../errors/customApiErrors";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {

    const token = req.cookies.token

    if (!token) {
        throw new customApiErrors.UnauthenticatedError("No token found")
    }

    if (!process.env.JWT_SECRET) {
        res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY)
        return
    }

    const payload = jwt.verify('token', process.env.JWT_SECRET) as { id: string, name: string, role: string }

    req.user = { id: payload.id, name: payload.name, role: payload.role }

    next()
}

export default authenticateUser