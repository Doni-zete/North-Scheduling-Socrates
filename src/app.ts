import 'dotenv/config'
import 'express-async-errors'
import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import errorHandler from './middlewares/errorHandler'
import notFoundRoute from './middlewares/notFoundRoute'

const app = express()
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.send('Running')
})

// Routers
import instructorAuthRouter from './routes/instructorRoutes'
import studentRoute from './routes/studentRoutes'

// Base page
app.get('/', (req: Request, res: Response) => {
    res.send('North Scheduling Socrates')
})

// Routes
app.use('/api/v1', instructorAuthRouter)
app.use('/api/v1', studentRoute)

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