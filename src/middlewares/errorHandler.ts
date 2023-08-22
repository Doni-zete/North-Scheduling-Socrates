import express from 'express'
import mongoose from 'mongoose'
import customApiErrors from '../errors/customApiErrors'
import { StatusCodes } from "http-status-codes"


export function errorHandler(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    // console.log(err)

    if (err instanceof customApiErrors.CustomApiError) {
        return res.status(err.statusCode).json({ msg: err.message })
    }

    // This error is from MongoServerError, not mongoose.Error - {unique: true} in schema
    if (err.code && err.code === 11000) {
        err.message = `Invalid value for ${Object.keys(err.keyValue)} field. Please, try again!`

        return res.status(StatusCodes.BAD_REQUEST).json({ msg: err.message })
    }

    if (err instanceof mongoose.Error.ValidationError) {
        err.message = Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: err.message })
    }

    if (err instanceof mongoose.Error.CastError) {
        err.message = `No item found with ${err.path}: ${err.value}`
        return res.status(StatusCodes.NOT_FOUND).json({ msg: err.message })
    }
    
    if (err instanceof mongoose.Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: '500 Internal Server DB Error' })
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: '500 Internal Server Error' })
}