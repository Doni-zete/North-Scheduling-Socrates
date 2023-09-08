import 'dotenv/config'
import 'express-async-errors'
import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import errorHandler from './middlewares/errorHandler'
import notFoundRoute from './middlewares/notFoundRoute'
import cookieParser from 'cookie-parser'
import swaggerUi from 'swagger-ui-express'
import swaggerDocs from './swagger.json'
import fileUpload from 'express-fileupload'

const app = express()
app.use(express.json())

app.use(cookieParser(process.env.JWT_SECRET))

app.use(fileUpload({
	limits: {
		fileSize: 10 * 1024 * 1024, // Limite de 10 MB
		files: 1 // Limite de 1 arquivo por vez
	},
	useTempFiles: true,
	safeFileNames: true,
	preserveExtension: true,
	abortOnLimit: true,
	responseOnLimit: 'File size limit has been reached'
}))

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

// Routers
import adminRoute from './routes/adminRoutes'
import instructorRoute from './routes/instructorRoutes'
import studentRoute from './routes/studentRoutes'
import availabilityRoute from './routes/availabilityRoutes'
import appointmentRoute from './routes/appointmentRoutes'

// Base page
app.get('/', (req: Request, res: Response) => {
	res.send('North Scheduling Socrates')
})

// Routes
app.use('/api', adminRoute)
app.use('/api', instructorRoute)
app.use('/api', studentRoute)
app.use('/api', availabilityRoute)
app.use('/api', appointmentRoute)

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