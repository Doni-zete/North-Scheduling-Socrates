import mongoose from 'mongoose'
import AppointmentDocument from './appointmentDocument'


const appointmentSchema = new mongoose.Schema({
	instructorId: mongoose.Schema.ObjectId,
	studentId: mongoose.Schema.ObjectId,
	date: {
		type: String, required: [true, 'Enter your date']
	},
	hour: {
		type: String, required: [true, 'Enter your hour']
	},
})


const Appointment = mongoose.model<AppointmentDocument>('Appointment', appointmentSchema)

export default Appointment