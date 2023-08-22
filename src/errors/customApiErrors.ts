import { StatusCodes } from "http-status-codes"

class CustomApiError extends Error {
    statusCode: number

    constructor(message: string, statusCode: number) {
        super(message)
        this.statusCode = statusCode
    }
}

class BadRequestError extends CustomApiError {
    constructor(message: string) {
        super(message, StatusCodes.BAD_REQUEST)
    }
}

class UnauthenticatedError extends CustomApiError {
    constructor(message: string) {
        super(message, StatusCodes.UNAUTHORIZED)
    }
}

class UnauthorizedError extends CustomApiError {
    constructor(message: string) {
        super(message, StatusCodes.FORBIDDEN)
    }
}

class NotFoundError extends CustomApiError {
    constructor(message: string) {
        super(message, StatusCodes.NOT_FOUND)
    }
}

const customApiErrors = { CustomApiError, BadRequestError, UnauthenticatedError, UnauthorizedError, NotFoundError }

export default customApiErrors