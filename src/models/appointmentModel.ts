import mongoose from 'mongoose'
import AppointmentDocument from './appointmentDocument'
import { ObjectId } from 'mongodb'

const appointmentSchema = new mongoose.Schema({
	instructorId: ObjectId,
	studentId: ObjectId,
	date: {
		type: String, required: [true, 'Enter your date']
	},
	hour: {
		type: String, required: [true, 'Enter your hour']
	},
})


const Appointment = mongoose.model<AppointmentDocument>('Appointment', appointmentSchema)

export default Appointment