import 'dotenv/config'
import 'express-async-errors'
import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import errorHandler from './middlewares/errorHandler'
import notFoundRoute from './middlewares/notFoundRoute'
import cookieParser from 'cookie-parser'
import swaggerUi from 'swagger-ui-express'
import swaggerDocs from './swagger.json'

const app = express()
app.use(express.json())

app.use(cookieParser(process.env.JWT_SECRET))

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

// Routers
import instructorRoute from './routes/instructorRoutes'
import studentRoute from './routes/studentRoutes'

// Base page
app.get('/', (req: Request, res: Response) => {
    res.send('North Scheduling Socrates')
})

// Routes
app.use('/api', instructorRoute)
app.use('/api', studentRoute)

// Middlewares
app.use(notFoundRoute)
app.use(errorHandler)

async function start() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Database connected!')

        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}!`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()