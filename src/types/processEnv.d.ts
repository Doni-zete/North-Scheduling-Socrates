namespace NodeJS {
    import jwt from 'jsonwebtoken'
    interface ProcessEnv {
        PORT: number
        MONGO_URI: string
        JWT_SECRET: jwt.Secret
        JWT_LIFETIME: number
    }
}