declare namespace Express {
    interface Request {
        user: {
            id: string
            name: string
            role: string
        }
    }
}